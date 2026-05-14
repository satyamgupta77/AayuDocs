import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { razorpay } from "@/lib/razorpay";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    // Check if user already has an active subscription
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { subscription: true }
    });

    if (dbUser?.subscription?.status === "ACTIVE") {
      return NextResponse.json({ error: "User already has an active subscription" }, { status: 400 });
    }

    // Create a Razorpay Subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // For monthly, or 1 for yearly, etc. Just setting 12 as default for recurring
      notes: {
        userId: userId,
      }
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error: any) {
    console.error("Razorpay subscription creation failed:", error);
    return NextResponse.json({ error: error.message || "Failed to create subscription" }, { status: 500 });
  }
}
