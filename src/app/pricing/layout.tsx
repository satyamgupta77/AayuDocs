import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans",
  description: "Simple, transparent pricing for AayuDocs. Choose the plan that works best for you and unlock unlimited document processing power.",
  openGraph: {
    title: "AayuDocs Pricing & Plans",
    description: "Upgrade to Pro for unlimited PDF conversions, AI tools, and priority support.",
    url: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
