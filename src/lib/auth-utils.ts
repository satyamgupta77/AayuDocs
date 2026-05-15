import prisma from "@/lib/db";

/**
 * Checks if a user has active PRO status, either via subscription or VIP whitelist.
 */
export async function checkProStatus(email: string | undefined, clerkId: string | null | undefined, username?: string | null) {
  if (!email && !clerkId && !username) return false;

  // 1. Check Hardcoded Super Admin
  if (email === "forsatyam2018@gmail.com" || username === "satyam7705") return true;

  // 2. Check VIP Whitelist
  if (email) {
    const isWhitelisted = await prisma.whitelistedEmail.findUnique({
      where: { email }
    });
    if (isWhitelisted) return true;
  }

  // 3. Check Database Subscription
  if (clerkId) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { subscription: true }
    });

    if (user?.subscription?.status === "ACTIVE" && user.subscription.plan.startsWith("PRO")) {
      return true;
    }
  }

  return false;
}
