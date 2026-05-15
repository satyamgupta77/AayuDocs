import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Manage your documents, view your processing history, and access your AayuDocs account settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
