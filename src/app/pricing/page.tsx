import { PricingClient } from "@/components/pricing/PricingClient";
import { auth, currentUser } from "@clerk/nextjs/server";
import { checkProStatus } from "@/lib/auth-utils";

export default async function PricingPage() {
  const { userId } = await auth();
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  
  const isPro = await checkProStatus(email, userId || undefined, user?.username);

  return <PricingClient isProUser={isPro} />;
}
