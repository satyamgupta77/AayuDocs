import prisma from "@/lib/db";

// -- USER SERVICES --
export const createUser = async (clerkId: string, email: string, firstName?: string, lastName?: string, imageUrl?: string) => {
  return await prisma.user.create({
    data: {
      clerkId,
      email,
      firstName,
      lastName,
      imageUrl,
    },
  });
};

export const getUserByClerkId = async (clerkId: string) => {
  return await prisma.user.findUnique({
    where: { clerkId },
    include: {
      subscription: true,
    }
  });
};

export const updateUser = async (clerkId: string, data: any) => {
  return await prisma.user.update({
    where: { clerkId },
    data,
  });
};

// -- TOOL USAGE SERVICES --
export const incrementToolUsage = async (userId: string, toolSlug: string) => {
  return await prisma.toolUsage.upsert({
    where: {
      userId_toolSlug: {
        userId,
        toolSlug,
      },
    },
    update: {
      count: { increment: 1 },
      lastUsed: new Date(),
    },
    create: {
      userId,
      toolSlug,
      count: 1,
    },
  });
};

// -- CONVERSION SERVICES --
export const logConversion = async (userId: string, toolUsed: string, status: string = "COMPLETED", errorMessage?: string) => {
  return await prisma.conversion.create({
    data: {
      userId,
      toolUsed,
      status,
      errorMessage,
    },
  });
};

export const getUserConversions = async (userId: string, limit: number = 10) => {
  return await prisma.conversion.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};

// -- SUBSCRIPTION SERVICES --
export const createOrUpdateSubscription = async (userId: string, plan: string, status: string, razorpayCustomerId?: string) => {
  return await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status,
      ...(razorpayCustomerId && { razorpayCustomerId }),
    },
    create: {
      userId,
      plan,
      status,
      razorpayCustomerId,
    },
  });
};
