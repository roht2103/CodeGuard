import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Activity, Code, ChevronRight, CheckCircle2, Plus, X } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Landing() {
  const { token } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-20 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 dark:bg-indigo-500/10 blur-[120px] -z-10 pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-xs font-semibold tracking-widest uppercase border border-gray-200 dark:border-white/10 mb-2">
              AI-Powered Code Analysis
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Ship secure code.<br />Validate instantly.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed mx-auto">
              Connect your repository, describe your security requirements, and get instant vulnerability analysis with line-by-line visualization — in seconds, not hours.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              <Link to={token ? "/dashboard" : "/register"}>
                <Button size="lg" className="w-full sm:w-auto px-8">
                  Get Started
                </Button>
              </Link>
              {!token && (
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats Ribbon */}
            <div className="mt-20 p-6 rounded-3xl bg-gray-50/50 dark:bg-[#111827]/50 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
              <div className="grid md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-white/10">
                <div className="p-4 md:px-8">
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Avg Quality Score</div>
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">87%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Excellent Fit</div>
                </div>
                <div className="p-4 md:px-8 pt-6 md:pt-4">
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Files Analyzed</div>
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">4.2M</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Across all repositories</div>
                </div>
                <div className="p-4 md:px-8 pt-6 md:pt-4">
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Issues Prevented</div>
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">850k+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Vulnerabilities caught</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 bg-gray-50 dark:bg-black border-y border-gray-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheck size={28} className="text-gray-900 dark:text-white" />,
                  title: "Instant Vulnerability Detection",
                  desc: "Find security flaws, hardcoded secrets, and logic bugs instantly before they reach production."
                },
                {
                  icon: <Activity size={28} className="text-gray-900 dark:text-white" />,
                  title: "Repository Quality Tracking",
                  desc: "Monitor tech debt, complexity, and duplication scores over time across multiple branches."
                },
                {
                  icon: <Code size={28} className="text-gray-900 dark:text-white" />,
                  title: "Actionable Insights",
                  desc: "Get context-aware, line-by-line suggestions on how to resolve identified code smells."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-gray-200 dark:border-white/10 shadow-sm transition-transform hover:-translate-y-1">
                  <div className="mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 py-32 max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              { q: "How does the AI analysis work?", a: "CodeGuard uses advanced Large Language Models trained specifically on millions of lines of secure, production-grade code. It scans your AST (Abstract Syntax Tree) and compares patterns to identify security flaws and anti-patterns." },
              { q: "Is my source code secure?", a: "Yes. Your code is processed entirely in memory during the analysis phase. We do not store your source code snippets on our servers, and your private repositories are never used to train our base models." },
              { q: "Do I need a GitHub account?", a: "Currently, yes. CodeGuard requires a GitHub Personal Access Token to authenticate and securely fetch the repository contents you wish to analyze." },
            ].map((faq, i) => (
              <div key={i} className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden transition-all duration-200">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white tracking-tight pr-4">{faq.q}</h3>
                  {openFaq === i ? (
                    <X size={20} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  ) : (
                    <Plus size={20} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 md:px-8 pb-6 pt-0 animate-fade-in">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B1120] px-6 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-gray-900 dark:text-white" size={24} />
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                CodeGuard
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm leading-relaxed">
              Intelligent code security for developers, engineering teams, and enterprises.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/register" className="hover:text-gray-900 dark:hover:text-white transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/dashboard" className="hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/docs" className="hover:text-gray-900 dark:hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="mailto:support@codeguard.io" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact: support@codeguard.io</a></li>
              <li><Link to="/docs" className="hover:text-gray-900 dark:hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 dark:border-white/10 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} CodeGuard Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
