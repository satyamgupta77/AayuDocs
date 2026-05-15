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

  const title = `${tool.title} | AayuDocs`;
  const description = `${tool.description} Fast, secure, and free online tool.`;

  return {
    title: tool.title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "article",
      url: `/tools/${tool.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
  };
}

// Generate static params for all known tools to prerender at build time
export function generateStaticParams() {
  return toolsConfig.map((tool) => ({
    slug: tool.slug,
  }));
}

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export default async function ToolPage(props: Props) {
  const params = await props.params;
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const { userId } = await auth();
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  
  let isPro = false;

  if (userId) {
    // Special access for forsatyam2018@gmail.com
    if (email === "forsatyam2018@gmail.com") {
      isPro = true;
    } else {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: { subscription: true }
      });
      if (dbUser?.subscription?.status === "ACTIVE" && dbUser.subscription?.plan.startsWith("PRO")) {
        isPro = true;
      }
    }
  }

  return <ToolRenderer toolSlug={tool.slug} isPro={isPro} />;
}
