import crypto from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "../db/db.js";
import { billingOperations, billingSubscriptions, billingWebhookEvents, users } from "../db/schema.js";

const apiUrl = () => process.env.BACHS_API_URL || "https://sandbox-api.bachs.io";
const accessStatuses = new Set(["trialing", "active", "past_due"]);
const getPlanProduct = (plan: string) => ({
  pro: process.env.BACHS_PRO_MONTHLY,
  // ultra: process.env.BACHS_ULTRA_MONTHLY,
  ultra: process.env.BACHS_ULTRA_DAILY,
  daily: process.env.BACHS_PRO_DAILY,
  monthly: process.env.BACHS_PRO_MONTHLY,
}[plan]);
 
type BachsSubscription = {
  subscription_id: string;
  customer?: { customer_id?: string };
  customer_id?: string;
  product_id: string;
  status: string;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  metadata?: { user_id?: string };
  [key: string]: unknown;
};

const requireConfig = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
};

async function bachsPost(path: string, body: object, idempotencyKey: string) {
  const response = await fetch(`${apiUrl()}/v1${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireConfig("BACHS_API_KEY")}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(body),
  });
  const responseBody = await response.text();
  if (!response.ok) throw new Error(`BACHS ${response.status}: ${responseBody}`);
  return JSON.parse(responseBody) as Record<string, unknown>;
}

// Next thing to work on would be to make 
// limit free users and and enable paid users to better
//  features depending on the tier


export const checkout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string | undefined;
    const plan = typeof req.body?.plan === "string" ? req.body.plan : "";
    const attemptId = typeof req.body?.attemptId === "string" ? req.body.attemptId : "";
    const productId = getPlanProduct(plan);
    if (!userId) return res.status(401).json({ message: "Authentication required" });
    if (!productId) return res.status(400).json({ message: "Unknown plan" });
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(attemptId)) {
      return res.status(400).json({ message: "A valid checkout attempt ID is required" });
    }

    const [existing] = await db.select().from(billingSubscriptions).where(eq(billingSubscriptions.userId, userId));
    if (existing && accessStatuses.has(existing.status)) {
      console.log("=====================subscription is already active==================")
      return res.status(409).json({ message: "Subscription already active", manageBilling: true });
    }
    
    const [user] = await db.select({ email: users.email, name: users.name }).from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ message: "User not found" });

    // Each deliberate checkout click gets a new attempt ID. Retries of that
    // same request reuse this key, while a later click cannot reuse an expired
    // BACHS checkout URL from an earlier attempt.
    const idempotencyKey = `checkout_${userId}_${plan}_${attemptId}`;
    const [operation] = await db.insert(billingOperations).values({ idempotencyKey, userId, operation: "checkout", plan }).onConflictDoNothing().returning();
    if (!operation) {
      const [savedOperation] = await db.select().from(billingOperations).where(eq(billingOperations.idempotencyKey, idempotencyKey));
      if (savedOperation?.checkoutUrl) return res.status(200).json({ checkout_url: savedOperation.checkoutUrl });
    }
    const customer = existing
      ? { customer_id: existing.bachsCustomerId }
      : { email: user.email, ...(user.name ? { name: user.name } : {}) };
    const body: Record<string, unknown> = {
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer,
      billing_currency: process.env.BACHS_BILLING_CURRENCY || "USD",
      metadata: { user_id: userId },
    };
    if (process.env.CHECKOUT_SUCCESS_URL) body.success_url = process.env.CHECKOUT_SUCCESS_URL;
    if (process.env.CHECKOUT_CANCEL_URL) body.cancel_url = process.env.CHECKOUT_CANCEL_URL;
    const result = await bachsPost("/checkout-sessions", body, idempotencyKey);
    if (typeof result.checkout_url !== "string") throw new Error("BACHS checkout response did not include checkout_url");
    await db.update(billingOperations).set({
      checkoutId: typeof result.checkout_id === "string" ? result.checkout_id : null,
      checkoutUrl: result.checkout_url,
    }).where(eq(billingOperations.idempotencyKey, idempotencyKey));
    return res.status(200).json({ checkout_url: result.checkout_url });
  } catch (error) {
    console.error("Unable to create BACHS checkout", error);
    return res.status(502).json({ message: "Checkout outcome is uncertain; retry the same request" });
  }
};

export const portal = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string | undefined;
    if (!userId) return res.status(401).json({ message: "Authentication required" });
    const [subscription] = await db.select().from(billingSubscriptions).where(eq(billingSubscriptions.userId, userId));
    if (!subscription) return res.status(404).json({ message: "No billing customer exists" });
    const result = await bachsPost(`/customers/${subscription.bachsCustomerId}/portal-sessions`, {}, `portal_${userId}_${crypto.randomUUID()}`);
    return res.status(200).json({ url: result.url });
  } catch (error) {
    console.error("Unable to create BACHS customer portal session", error);
    return res.status(502).json({ message: "Unable to open billing portal" });
  }
};

const verifySignature = (rawBody: Buffer, header: string | undefined, secret: string) => {
  if (!header) return false;
  const parts = header.split(",").map((part) => part.trim().split("="));
  const timestamp = Number(parts.find(([key]) => key === "t")?.[1]);
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${rawBody.toString()}`).digest("hex");
  return parts.filter(([key, value]) => key === "v1" && value).some(([, value]) => {
    const supplied = Buffer.from(value);
    const actual = Buffer.from(expected);
    return supplied.length === actual.length && crypto.timingSafeEqual(supplied, actual);
  });
};


// The whole webook function flow in one picture

// Keep the raw message untouched.
// Check the signature to prove it’s from Bachs.
// Read the message into an object.
// Open a transaction (all or nothing).
// Check the logbook so duplicates are skipped.
// Find which user it’s about using metadata.
// Save the subscription, but only if the event is newer than what’s stored.
// Mark the event as processed.
// Reply 200 if all good, 500 if something broke.
export const webhook = async (req: Request, res: Response) => {
  try {
    // keep raw message recieved from bach just as it came in its initial form to avoid data tampering
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from("");
    // Verify signature; Bachs attaches a secret code to the header which we were provided(BACHS_WEBHOOK_SECRET), also check ours(BACHS_WEBHOOK_SECRET) by also unscrambling
    // and if we unscramble both and we come up with the same secret then we can verify that its legit and untampered or fake
    if (!verifySignature(rawBody, req.header("X-Bachs-Signature-V2"), requireConfig("BACHS_WEBHOOK_SECRET"))) {
      return res.status(400).send("Invalid signature");
    }
    // After verification of no tampering or fake signature; arrange raw body into a readable Typescrpt object 
    const event = JSON.parse(rawBody.toString()) as { id: string; type: string; created_at: string; data: BachsSubscription };
    // Complete Transaction: which basically means every code running in "db.transaction" cannot be half started or half finished
    // in other words with db.transaction if the code in any part were to fail or crash its retracts it
    // e.g instead of the code crashing and the money stuck or vanishes it cancels the entire code cycle and starts again
    await db.transaction(async (tx) => {
      // im keeping a legder of list of recorded events and returning nothing if record already exist thus, implementing idempotency
      const inserted = await tx.insert(billingWebhookEvents).values({
        id: event.id, type: event.type, eventCreatedAt: new Date(event.created_at),
      }).onConflictDoNothing().returning({ id: billingWebhookEvents.id });
      // inserted would return an array[] if nothng exist, if so, stop the code.
      if (inserted.length === 0) return;

      if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
        const sub = event.data;
        const userId = sub.metadata?.user_id;
        const customerId = sub.customer?.customer_id || sub.customer_id;
        if (!userId || !customerId) throw new Error("Subscription event lacks user_id or customer_id");
        const eventDate = new Date(event.created_at);
        // Insert if data doesnt else update it
        await tx.insert(billingSubscriptions).values({
          userId, bachsCustomerId: customerId, bachsSubscriptionId: sub.subscription_id, productId: sub.product_id,
          status: sub.status, currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end) : null,
          cancelAtPeriodEnd: sub.cancel_at_period_end === true, state: sub, eventCreatedAt: eventDate,
        }).onConflictDoUpdate({
          target: billingSubscriptions.userId,
          set: {
            bachsCustomerId: customerId, bachsSubscriptionId: sub.subscription_id, productId: sub.product_id,
            status: sub.status, currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end) : null,
            cancelAtPeriodEnd: sub.cancel_at_period_end === true, state: sub, eventCreatedAt: eventDate, updatedAt: new Date(),
          },
          // always trust the most recent real action, and never let a late-arriving old message undo it.
          // this would help avoud situations the services is bad and a user probaly canceled the subscription by mistake
          // and then the resubscribed, without this line of code, if the cancel function is to land later after the resubscribed do to bad service
          // the final action would be to cancel even if the user want to actually resubscribe
          // this line of could is the last line of defence to avoid that
          where: lt(billingSubscriptions.eventCreatedAt, eventDate),
        });
      }
      await tx.update(billingWebhookEvents).set({ processedAt: new Date() }).where(eq(billingWebhookEvents.id, event.id));
    });
    return res.status(200).send("OK");
  } catch (error) {
    console.error("BACHS webhook processing failed", error);
    return res.status(500).send("Webhook processing failed");
  }
};

export const billingStatus = async (req: Request, res: Response) => {
  const [subscription] = await db.select().from(billingSubscriptions).where(eq(billingSubscriptions.userId, req.user.id));
  return res.status(200).json({ subscription: subscription ? { ...subscription, hasAccess: accessStatuses.has(subscription.status) } : null });
};