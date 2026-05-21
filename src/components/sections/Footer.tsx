import Link from "next/link";
import { FileText, MessageCircle, Globe, Building2, Camera } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6 inline-flex">
              <img 
                src="/logo.png" 
                alt="AayuDocs Logo" 
                className="w-10 h-10 rounded-xl object-contain shadow-sm" 
              />
              <span className="text-2xl font-bold text-white tracking-tight">
                AayuDocs
              </span>
            </Link>
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
              The ultimate all-in-one document workspace. Convert, merge, split, and compress your files quickly and securely.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors">
                <Globe size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors">
                <Building2 size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors">
                <Camera size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Popular Tools</h4>
            <ul className="space-y-4">
              <li><Link href="/tools/word-to-pdf" className="hover:text-violet-400 transition-colors">Word to PDF</Link></li>
              <li><Link href="/tools/merge-pdf" className="hover:text-violet-400 transition-colors">Merge PDF</Link></li>
              <li><Link href="/tools/split-pdf" className="hover:text-violet-400 transition-colors">Split PDF</Link></li>
              <li><Link href="/tools/compress-pdf" className="hover:text-violet-400 transition-colors">Compress PDF</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Direct Support</h4>
            <div className="space-y-3 text-sm">
              <p className="text-slate-400">Need instant activation or custom queries?</p>
              <p className="flex items-center text-slate-300">
                <span className="font-semibold text-violet-400 mr-2">Email:</span>
                <a href="mailto:forsatyam2018@gmail.com" className="text-white hover:underline font-bold bg-violet-950/50 px-2 py-1 rounded border border-violet-800">
                  forsatyam2018@gmail.com
                </a>
              </p>
              <p className="flex items-center text-slate-300">
                <span className="font-semibold text-emerald-400 mr-2">WhatsApp:</span>
                <a href="https://wa.me/917705879297" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-bold">
                  +91 7705879297
                </a>
              </p>
              <p className="text-xs text-amber-400/90 leading-tight mt-2 bg-amber-950/30 p-2 rounded border border-amber-900/50">
                ⚠️ Purchased a subscription but plan not updated? Message us on WhatsApp or Email directly with payment screenshot!
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/pricing" className="hover:text-violet-400 transition-colors">Pricing & Plans</Link></li>
              <li><Link href="/blog" className="hover:text-violet-400 transition-colors">Insights & Blog</Link></li>
              <li><Link href="/#faq" className="hover:text-violet-400 transition-colors">Help & FAQ</Link></li>
              <li><a href="https://wa.me/917705879297" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Chat Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} AayuDocs. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
