import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Blog",
  description: "Stay updated with the latest document processing tips, PDF guides, and AI document editing insights from AayuDocs.",
  openGraph: {
    title: "AayuDocs Blog - Document Processing Insights",
    description: "Learn how to optimize your workflow with AayuDocs' latest guides and articles.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
