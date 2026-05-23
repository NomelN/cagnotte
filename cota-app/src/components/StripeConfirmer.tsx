import React, { useEffect, useRef } from 'react';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { callStripe } from '../lib/stripe';

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

// Status reported back to the parent screen as the flow progresses, so it can
// show meaningful step labels without knowing anything about Stripe internals.
export type ConfirmerStep =
  | 'creating'
  | 'authenticating'
  | 'finalizing'
  | 'done';

export interface ConfirmerResult {
  ok: boolean;
  error?: string;
  contributionId?: string;
}

interface Props {
  potId: string;
  amount: number;
  cardId: string;
  onStep?: (step: ConfirmerStep) => void;
  onResult: (result: ConfirmerResult) => void;
}

function Inner({ potId, amount, cardId, onStep, onResult }: Props) {
  const { handleNextAction } = useStripe();
  const ranRef = useRef(false);

  useEffect(() => {
    // React 18 strict-mode double-invokes effects in dev. Without this guard
    // we'd create two PaymentIntents and double-charge the user.
    if (ranRef.current) return;
    ranRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        onStep?.('creating');
        const { paymentIntentStatus, clientSecret, contributionId } = await callStripe<{
          paymentIntentStatus: string;
          clientSecret: string;
          contributionId: string;
        }>({
          action: 'create-payment-intent',
          potId,
          amount,
          cardId,
        });
        if (cancelled) return;

        let finalStatus = paymentIntentStatus;

        // 3D-Secure (or any next action) needs to be handled on-device.
        if (finalStatus === 'requires_action') {
          onStep?.('authenticating');
          const { paymentIntent, error } = await handleNextAction(clientSecret);
          if (cancelled) return;
          if (error) throw new Error(error.message);
          finalStatus = paymentIntent?.status ?? 'unknown';
        }

        // Always finalize on the server so the DB reflects the final Stripe state
        // even if the status flipped between create and now.
        onStep?.('finalizing');
        const finalized = await callStripe<{ status: string }>({
          action: 'finalize-contribution',
          contributionId,
        });
        if (cancelled) return;
        finalStatus = finalized.status ?? finalStatus;

        onStep?.('done');
        if (finalStatus === 'succeeded') {
          onResult({ ok: true, contributionId });
        } else if (
          finalStatus === 'requires_payment_method' ||
          finalStatus === 'canceled' ||
          finalStatus === 'failed'
        ) {
          onResult({ ok: false, error: 'Carte refusée. Vérifiez votre carte ou essayez-en une autre.', contributionId });
        } else {
          onResult({ ok: false, error: `Paiement non finalisé (état: ${finalStatus}).`, contributionId });
        }
      } catch (e) {
        if (cancelled) return;
        onResult({ ok: false, error: e instanceof Error ? e.message : 'Erreur de paiement.' });
      }
    })();

    return () => {
      cancelled = true;
    };
    // We intentionally run this once on mount with the initial props — re-running
    // would create another PaymentIntent. Parent guarantees stable props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function StripeConfirmer(props: Props) {
  if (!PUBLISHABLE_KEY) {
    // Mount-time guard so the screen still functions if the key is missing.
    React.useEffect(() => {
      props.onResult({ ok: false, error: "Clé Stripe non configurée dans l'app." });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  }
  return (
    <StripeProvider publishableKey={PUBLISHABLE_KEY}>
      <Inner {...props} />
    </StripeProvider>
  );
}
