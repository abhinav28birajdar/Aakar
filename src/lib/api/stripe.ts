// src/lib/api/stripe.ts
import { siteConfig } from '../constants';

export async function initiateCheckoutSession(productId: string, userId: string, quantity: number = 1): Promise<{ checkoutUrl?: string; error?: string; }> {
  const res = await fetch(`${siteConfig.nextJsApiBaseUrl}/api/stripe/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, userId, quantity }),
  });
  return res.json();
}

export async function initiateStripeConnectOnboarding(userId: string): Promise<{ onboardingUrl?: string; error?: string; }> {
  const res = await fetch(`${siteConfig.nextJsApiBaseUrl}/api/stripe/create-connect-onboarding-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}
