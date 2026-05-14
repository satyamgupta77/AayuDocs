import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle Subscription charged/activated
    if (event.event === "subscription.charged" || event.event === "subscription.activated") {
      const subscription = event.payload.subscription.entity;
      const userId = subscription.notes?.userId;

      if (!userId) {
        return NextResponse.json({ error: "No userId in notes" }, { status: 400 });
      }

      const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
      
      if (dbUser) {
        await prisma.subscription.upsert({
          where: { userId: dbUser.id },
          create: {
            userId: dbUser.id,
            plan: "PRO_MONTHLY", // Can dynamically set based on plan_id mapping
            status: "ACTIVE",
            razorpaySubscriptionId: subscription.id,
            razorpayCustomerId: subscription.customer_id,
            currentPeriodEnd: new Date(subscription.current_end * 1000),
          },
          update: {
            status: "ACTIVE",
            razorpaySubscriptionId: subscription.id,
            currentPeriodEnd: new Date(subscription.current_end * 1000),
          }
        });
      }
    }

    // Handle cancellation
    if (event.event === "subscription.cancelled") {
      const subscription = event.payload.subscription.entity;
      await prisma.subscription.update({
        where: { razorpaySubscriptionId: subscription.id },
        data: { status: "CANCELED" }
      });
    }

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
