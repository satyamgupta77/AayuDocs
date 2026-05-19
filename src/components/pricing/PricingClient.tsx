"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface PricingClientProps {
  isProUser: boolean;
}

export function PricingClient({ isProUser }: PricingClientProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [isRecurring, setIsRecurring] = useState(true);
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSubscribe = async (planId: string) => {
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();

      if (!data.subscriptionId) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        subscription_id: data.subscriptionId,
        name: "AayuDocs Pro",
        description: isYearly ? "Yearly Subscription" : "Monthly Subscription",
        prefill: {
          name: user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : ""),
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: user?.primaryPhoneNumber?.phoneNumber || "",
        },
        handler: function (response: any) {
          router.push("/payment/success");
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        router.push("/payment/failed");
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOneTimePayment = async (planId: string) => {
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();

      if (!data.orderId) {
        throw new Error(data.error || "Failed to initiate order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "AayuDocs Pro",
        description: isYearly ? "Yearly Pro One-Time Payment" : "Monthly Pro One-Time Payment",
        order_id: data.orderId,
        prefill: {
          name: user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : ""),
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: user?.primaryPhoneNumber?.phoneNumber || "",
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              router.push("/payment/success");
            } else {
              router.push("/payment/failed");
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            router.push("/payment/failed");
          }
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        router.push("/payment/failed");
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24">
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Unlock the full potential of AayuDocs with our Pro plan. Unlimited document processing, priority support, and powerful AI features.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-violet-600 transition-colors focus:outline-none"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-medium ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                Yearly <span className="text-emerald-500 text-xs ml-1 font-bold">-20%</span>
              </span>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${isRecurring ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Auto-Renewal (Autopay)</span>
              <button 
                onClick={() => setIsRecurring(!isRecurring)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-violet-600 transition-colors focus:outline-none"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${!isRecurring ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-medium ${!isRecurring ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>One-Time Payment</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Essential tools for casual users.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">₹0</span>
              <span className="text-slate-500">/forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-slate-600 dark:text-slate-300">
                <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0" /> Up to 3 document conversions / day
              </li>
              <li className="flex items-center text-slate-600 dark:text-slate-300">
                <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0" /> Max file size 10MB
              </li>
              <li className="flex items-center text-slate-600 dark:text-slate-300">
                <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0" /> Basic PDF & Image tools
              </li>
              <li className="flex items-center text-slate-400 dark:text-slate-500">
                <X className="h-5 w-5 mr-3 shrink-0" /> No AI Features
              </li>
              <li className="flex items-center text-slate-400 dark:text-slate-500">
                <X className="h-5 w-5 mr-3 shrink-0" /> Standard Support
              </li>
            </ul>
            <Button variant="outline" className="w-full h-12 rounded-xl text-lg font-semibold" onClick={() => router.push("/sign-up")}>
              Get Started Free
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-violet-500/30 shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">AayuDocs Pro</h3>
            <p className="text-slate-400 mb-6">Unlimited power for professionals.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₹{isYearly ? '3999' : '399'}</span>
              <span className="text-slate-400">/{isYearly ? 'year' : 'month'}</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-violet-400 mr-3 shrink-0" /> Unlimited document conversions
              </li>
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-violet-400 mr-3 shrink-0" /> Max file size 2GB
              </li>
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-violet-400 mr-3 shrink-0" /> Access to all Premium AI Tools
              </li>
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-violet-400 mr-3 shrink-0" /> Priority processing speed
              </li>
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-violet-400 mr-3 shrink-0" /> 24/7 Priority Support
              </li>
            </ul>
            <Button 
              className="w-full h-12 rounded-xl text-lg font-semibold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0"
              onClick={() => {
                const planId = isYearly ? process.env.NEXT_PUBLIC_RAZORPAY_YEARLY_PLAN_ID! : process.env.NEXT_PUBLIC_RAZORPAY_MONTHLY_PLAN_ID!;
                if (isRecurring) {
                  handleSubscribe(planId);
                } else {
                  handleOneTimePayment(planId);
                }
              }}
              disabled={loading || isProUser}
            >
              {loading ? "Initializing..." : isProUser ? "Active" : isRecurring ? "Upgrade to Pro (Subscribe)" : "Upgrade to Pro (One-Time)"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
