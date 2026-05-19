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

    const isYearly = planId?.includes("yearly") || planId?.includes("year");
    const amount = isYearly ? 399900 : 39900; // in paise

    // Check if user already has active status
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { subscription: true }
    });

    if (dbUser?.subscription?.status === "ACTIVE") {
      return NextResponse.json({ error: "User already has active access" }, { status: 400 });
    }

    // Create a Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId,
        plan: isYearly ? "PRO_YEARLY" : "PRO_MONTHLY",
      }
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
