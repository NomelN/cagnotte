import { supabase } from './supabase';

// Calls the `stripe` Edge Function and surfaces its JSON error message.
// Safe to import anywhere — it does NOT pull in the native Stripe SDK.
export async function callStripe<T = unknown>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('stripe', { body });
  if (error) {
    let message = error.message;
    const ctx = (error as { context?: { json?: () => Promise<{ error?: string }> } }).context;
    if (ctx?.json) {
      try {
        const parsed = await ctx.json();
        if (parsed?.error) message = parsed.error;
      } catch {
        /* keep the default message */
      }
    }
    throw new Error(message);
  }
  return data as T;
}
