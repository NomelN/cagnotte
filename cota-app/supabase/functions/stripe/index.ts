// @ts-nocheck — Deno runtime; VS Code's Node tsserver doesn't know about
// `npm:` specifiers or the global `Deno`. Supabase typechecks this file with
// Deno at deploy time. Install the "Deno" VS Code extension if you want
// editor typechecking here.
//
// Supabase Edge Function: Stripe card management.
//
// Actions (POST JSON body { action, ... }):
//   - "setup-intent"          → creates/reuses a Stripe Customer + a SetupIntent
//   - "save-payment-method"   → persists a confirmed PaymentMethod's metadata
//   - "delete-payment-method" → detaches a card from Stripe and removes the row
//
// Requires the secret key as an Edge secret:
//   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
//
// The raw card number / CVV never reach this function — Stripe tokenises the
// card on-device. We only store brand / last4 / expiry in `payment_methods`.

import Stripe from 'npm:stripe@17';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? '';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2024-06-20',
});

// Service-role client — bypasses RLS for writes the function owns.
const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

// Resolve the authenticated user from the request's JWT.
async function getUser(req: Request) {
  const authHeader = req.headers.get('Authorization') ?? '';
  const authed = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data } = await authed.auth.getUser();
  return data.user;
}

// Return the user's Stripe customer id, creating one on first use.
async function getOrCreateCustomer(userId: string, email: string | null) {
  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id, first_name, last_name, email')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.stripe_customer_id) return profile.stripe_customer_id;

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');
  const customer = await stripe.customers.create({
    email: profile?.email ?? email ?? undefined,
    name: name || undefined,
    metadata: { supabase_user_id: userId },
  });

  await admin
    .from('profiles')
    .upsert({ id: userId, stripe_customer_id: customer.id }, { onConflict: 'id' });

  return customer.id;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    if (!STRIPE_SECRET_KEY) {
      return json({ error: 'STRIPE_SECRET_KEY non configurée sur le serveur.' }, 500);
    }

    const user = await getUser(req);
    if (!user) return json({ error: 'Non autorisé.' }, 401);

    const { action, paymentMethodId } = await req.json().catch(() => ({}));

    if (action === 'setup-intent') {
      const customerId = await getOrCreateCustomer(user.id, user.email ?? null);
      const intent = await stripe.setupIntents.create({
        customer: customerId,
        usage: 'off_session',
        payment_method_types: ['card'],
      });
      return json({ clientSecret: intent.client_secret, customerId });
    }

    if (action === 'save-payment-method') {
      if (!paymentMethodId) return json({ error: 'paymentMethodId manquant.' }, 400);

      const customerId = await getOrCreateCustomer(user.id, user.email ?? null);
      const pm = await stripe.paymentMethods.retrieve(paymentMethodId);

      // Make sure the card is attached to *this* user's customer.
      if (pm.customer && pm.customer !== customerId) {
        return json({ error: 'Cette carte appartient à un autre compte.' }, 403);
      }
      if (!pm.customer) {
        await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
      }

      const { count } = await admin
        .from('payment_methods')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { data, error } = await admin
        .from('payment_methods')
        .upsert(
          {
            user_id: user.id,
            stripe_customer_id: customerId,
            stripe_payment_method_id: paymentMethodId,
            brand: pm.card?.brand ?? null,
            last4: pm.card?.last4 ?? null,
            exp_month: pm.card?.exp_month ?? null,
            exp_year: pm.card?.exp_year ?? null,
            is_default: (count ?? 0) === 0,
          },
          { onConflict: 'stripe_payment_method_id' },
        )
        .select('id, brand, last4, exp_month, exp_year, is_default')
        .single();

      if (error) throw error;
      return json({ card: data });
    }

    if (action === 'delete-payment-method') {
      if (!paymentMethodId) return json({ error: 'paymentMethodId manquant.' }, 400);

      const { data: row } = await admin
        .from('payment_methods')
        .select('id')
        .eq('user_id', user.id)
        .eq('stripe_payment_method_id', paymentMethodId)
        .maybeSingle();

      if (!row) return json({ error: 'Carte introuvable.' }, 404);

      await stripe.paymentMethods.detach(paymentMethodId).catch(() => {});
      const { error } = await admin.from('payment_methods').delete().eq('id', row.id);
      if (error) throw error;

      return json({ ok: true });
    }

    return json({ error: `Action inconnue: ${action}` }, 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur Stripe inattendue.';
    return json({ error: message }, 400);
  }
});
