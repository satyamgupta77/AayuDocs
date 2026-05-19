import { NextResponse } from "next/server";
import { razorpay, verifyRazorpaySignature } from "@/lib/razorpay";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { orderId, paymentId, signature } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature(orderId, paymentId, signature);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Fetch order details to get userId and plan
    const order = await razorpay.orders.fetch(orderId);
    const clerkId = order.notes?.userId as string;
    const plan = order.notes?.plan as string;

    if (!clerkId) {
      return NextResponse.json({ error: "No userId in order notes" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({ where: { clerkId } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Calculate period end date (30 days for monthly, 365 days for yearly)
    const isYearly = plan === "PRO_YEARLY";
    const currentPeriodEnd = new Date();
    if (isYearly) {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    } else {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    // Upsert subscription table with the active status
    await prisma.subscription.upsert({
      where: { userId: dbUser.id },
      create: {
        userId: dbUser.id,
        plan: plan,
        status: "ACTIVE",
        razorpaySubscriptionId: orderId, // Save order id as subscription identification
        currentPeriodEnd: currentPeriodEnd,
      },
      update: {
        status: "ACTIVE",
        plan: plan,
        razorpaySubscriptionId: orderId,
        currentPeriodEnd: currentPeriodEnd,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Razorpay verification failed:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
