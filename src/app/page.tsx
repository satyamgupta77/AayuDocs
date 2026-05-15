import { Hero } from "@/components/sections/Hero";
import { ToolGrid } from "@/components/sections/ToolGrid";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-violet-200 selection:text-violet-900">
      <main>
        <Hero />
        <ToolGrid />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>
    </div>
  );
}
