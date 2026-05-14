import { notFound } from "next/navigation";
import { getToolBySlug, toolsConfig } from "@/config/tools";
import { ToolRenderer } from "@/components/shared/ToolRenderer";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  return {
    title: tool.title,
    description: tool.description,
  };
}

// Generate static params for all known tools to prerender at build time
export function generateStaticParams() {
  return toolsConfig.map((tool) => ({
    slug: tool.slug,
  }));
}

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export default async function ToolPage(props: Props) {
  const params = await props.params;
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const { userId } = await auth();
  let isPro = false;

  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { subscription: true }
    });
    if (dbUser?.subscription?.status === "ACTIVE" && dbUser.subscription.plan.startsWith("PRO")) {
      isPro = true;
    }
  }

  return <ToolRenderer toolSlug={tool.slug} isPro={isPro} />;
}
