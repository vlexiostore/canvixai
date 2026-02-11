import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}

// Credit packages (plans activated via coupon; these are for additional credit top-ups)
export const CREDIT_PACKAGES = [
  {
    id: "basic",
    name: "Basic Top-Up",
    credits: 500,
    price: 999, // in cents
    description: "500 image credits top-up",
  },
  {
    id: "pro",
    name: "Pro Top-Up",
    credits: 2000,
    price: 2999,
    description: "2,000 image credits top-up",
  },
  {
    id: "ultimate",
    name: "Ultimate Top-Up",
    credits: 5000,
    price: 5999,
    description: "5,000 image credits top-up",
  },
] as const;

/**
 * Create a Stripe Checkout session for credit purchase.
 */
export async function createCheckoutSession(
  stripeCustomerId: string | undefined,
  userId: string,
  packageId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) throw new Error(`Invalid package: ${packageId}`);

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Canvix ${pkg.name} Credits`,
            description: pkg.description,
          },
          unit_amount: pkg.price,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      packageId: pkg.id,
      credits: String(pkg.credits),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  if (stripeCustomerId) {
    sessionParams.customer = stripeCustomerId;
  }

  return getStripe().checkout.sessions.create(sessionParams);
}

/**
 * Verify and construct a Stripe webhook event.
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  return getStripe().webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
