import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const { payload } = event;

    // Handle subscription events
    if (event.event === "subscription.charged") {
      const subscription = payload.subscription.entity;
      const payment = payload.payment.entity;
      const userId = subscription.notes.userId;

      if (userId) {
        // Update user subscription in database
        await prisma.subscription.upsert({
          where: { razorpaySubscriptionId: subscription.id },
          update: {
            status: "ACTIVE",
            currentPeriodEnd: new Date(subscription.current_end * 1000),
          },
          create: {
            userId: userId,
            razorpaySubscriptionId: subscription.id,
            plan: subscription.plan_id === process.env.NEXT_PUBLIC_RAZORPAY_YEARLY_PLAN_ID ? "PRO_YEARLY" : "PRO_MONTHLY",
            status: "ACTIVE",
            currentPeriodEnd: new Date(subscription.current_end * 1000),
          }
        });

        console.log(`Subscription charged successfully for user: ${userId}`);
      }
    }

    if (event.event === "subscription.cancelled") {
      const subscription = payload.subscription.entity;
      await prisma.subscription.update({
        where: { razorpaySubscriptionId: subscription.id },
        data: { status: "CANCELLED" }
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
