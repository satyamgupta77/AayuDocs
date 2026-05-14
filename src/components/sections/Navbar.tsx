"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-violet-600 to-blue-500 text-white p-2 rounded-xl group-hover:scale-105 transition-transform">
              <FileText size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-blue-600">
              AayuDocs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#tools" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
              Tools
            </Link>
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400">
                    Log in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white border-0 shadow-md shadow-violet-200 dark:shadow-none">
                    Get Started Free
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 mr-2">
                    Dashboard
                  </Button>
                </Link>
                <UserButton appearance={{ elements: { avatarBox: "h-10 w-10" } }} />
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg py-4 px-4 flex flex-col space-y-4"
        >
          <Link href="#tools" className="text-base font-medium text-slate-700 p-2 hover:bg-slate-50 rounded-lg">
            Tools
          </Link>
          <Link href="#features" className="text-base font-medium text-slate-700 p-2 hover:bg-slate-50 rounded-lg">
            Features
          </Link>
          <Link href="#pricing" className="text-base font-medium text-slate-700 p-2 hover:bg-slate-50 rounded-lg">
            Pricing
          </Link>
          <div className="pt-4 flex flex-col space-y-2 border-t border-slate-100">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full justify-center">
                    Log in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full justify-center bg-gradient-to-r from-violet-600 to-blue-500 text-white">
                    Get Started Free
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full justify-center">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
