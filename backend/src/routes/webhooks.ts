import { Router } from 'express';
import { Webhook } from 'svix';
import { env } from '../lib/env';

const router = Router();

/**
 * In-memory / audit log store for delivered webhook events.
 * Prevents replay attacks and enables inspection.
 */
const processedEvents = new Set<string>();

/**
 * POST /api/webhooks/resend
 *
 * Receives Resend webhook events:
 * - email.sent
 * - email.delivered
 * - email.delivery_delayed
 * - email.bounced
 * - email.complained
 * - email.failed
 * - email.suppressed
 *
 * Verifies the svix signature using RESEND_WEBHOOK_SECRET.
 */
router.post('/', async (req, res) => {
  const webhookSecret = env.resendWebhookSecret;
  const rawBody = (req as any).rawBody;

  // Retrieve svix signature headers
  const svixId = req.headers['svix-id'] as string;
  const svixTimestamp = req.headers['svix-timestamp'] as string;
  const svixSignature = req.headers['svix-signature'] as string;

  if (webhookSecret) {
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.warn('[Resend Webhook] Missing svix signature headers');
      return res.status(401).json({ error: 'Missing webhook signature headers' });
    }

    try {
      const wh = new Webhook(webhookSecret);
      const payloadString = rawBody || JSON.stringify(req.body);
      wh.verify(payloadString, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[Resend Webhook] Invalid signature:', message);
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }
  } else {
    console.warn('[Resend Webhook] RESEND_WEBHOOK_SECRET is not configured. Skipping signature verification in dev mode.');
  }

  const event = req.body;
  const eventId = event?.id || svixId;

  // Idempotency: skip already processed events
  if (eventId && processedEvents.has(eventId)) {
    return res.status(200).json({ received: true, deduplicated: true });
  }

  if (eventId) {
    processedEvents.add(eventId);
    // Keep max 2,000 recent events
    if (processedEvents.size > 2000) {
      const first = processedEvents.values().next().value;
      if (first) processedEvents.delete(first);
    }
  }

  const eventType = event?.type;
  const emailData = event?.data;

  console.log(`[Resend Webhook] Received event: ${eventType} for recipient: ${emailData?.to || 'unknown'}`);

  switch (eventType) {
    case 'email.sent':
      console.log(`[Resend Webhook] Email ${emailData?.email_id} sent successfully`);
      break;
    case 'email.delivered':
      console.log(`[Resend Webhook] Email ${emailData?.email_id} confirmed delivered to ${emailData?.to}`);
      break;
    case 'email.bounced':
      console.warn(`[Resend Webhook] Email ${emailData?.email_id} bounced for ${emailData?.to}`);
      break;
    case 'email.complained':
      console.warn(`[Resend Webhook] Spam complaint received for email ${emailData?.email_id}`);
      break;
    case 'email.delivery_delayed':
      console.warn(`[Resend Webhook] Delivery delayed for ${emailData?.email_id}`);
      break;
    case 'email.failed':
    case 'email.suppressed':
      console.error(`[Resend Webhook] Email delivery ${eventType} for ${emailData?.email_id}`);
      break;
    default:
      console.log(`[Resend Webhook] Unhandled event type: ${eventType}`);
  }

  return res.status(200).json({ received: true, event: eventType });
});

export default router;
