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

    let targetPlanId = planId;
    const isYearly = planId.includes("yearly") || planId.includes("year");
    const totalCount = isYearly ? 5 : 60;

    // Handle placeholder plan IDs dynamically
    if (planId.startsWith("plan_placeholder_")) {
      const targetName = isYearly ? "AayuDocs Pro Yearly" : "AayuDocs Pro Monthly";
      const targetAmount = isYearly ? 399900 : 39900; // in paise
      const targetPeriod = isYearly ? "yearly" : "monthly";

      try {
        console.log(`Resolving placeholder plan ID for ${targetName}...`);
        const plansResponse = await razorpay.plans.all({ count: 100 });
        const existingPlan = plansResponse.items?.find(
          (p: any) => p.item?.name === targetName && p.item?.amount === targetAmount
        );

        if (existingPlan) {
          targetPlanId = existingPlan.id;
          console.log(`Found existing plan: ${targetPlanId}`);
        } else {
          console.log(`Creating new plan dynamically on Razorpay...`);
          const newPlan = await razorpay.plans.create({
            period: targetPeriod,
            interval: 1,
            item: {
              name: targetName,
              amount: targetAmount,
              currency: "INR",
              description: isYearly ? "Yearly Pro Subscription" : "Monthly Pro Subscription",
            },
          });
          targetPlanId = newPlan.id;
          console.log(`Created new plan: ${targetPlanId}`);
        }
      } catch (err: any) {
        console.error("Error resolving Razorpay plan dynamically:", err);
      }
    }

    // Create a Razorpay Subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: targetPlanId,
      customer_notify: 1,
      total_count: totalCount,
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
