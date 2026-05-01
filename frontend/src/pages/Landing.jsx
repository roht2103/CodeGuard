import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Activity, Code, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Landing() {
  const { token } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 overflow-hidden">
          {/* Subtle background blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-indigo-900/30 text-blue-600 dark:text-indigo-400 text-sm font-medium border border-blue-100 dark:border-indigo-800/50 mb-4 animate-fade-in">
              <Zap size={16} className="fill-current" />
              <span>Introducing CodeGuard 2.0</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              Secure and Optimize Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-400 dark:to-blue-400">
                Codebase with AI
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Automatically detect vulnerabilities, track quality trends, and help your team ship secure, production-ready code faster than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to={token ? "/dashboard" : "/register"}>
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  {token ? "Go to Dashboard" : "Start Scanning for Free"}
                  <ChevronRight size={18} />
                </Button>
              </Link>
              {!token && (
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In to Account
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-gray-50/50 dark:bg-gray-900/20 border-y border-gray-100 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Everything you need to ship with confidence
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                CodeGuard provides a comprehensive suite of tools to maintain high standards across your entire engineering organization.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheck size={28} className="text-blue-600 dark:text-indigo-400" />,
                  title: "Instant Vulnerability Detection",
                  desc: "Find security flaws, hardcoded secrets, and logic bugs instantly before they reach production."
                },
                {
                  icon: <Activity size={28} className="text-blue-600 dark:text-indigo-400" />,
                  title: "Repository Quality Tracking",
                  desc: "Monitor tech debt, complexity, and duplication scores over time across multiple branches."
                },
                {
                  icon: <Code size={28} className="text-blue-600 dark:text-indigo-400" />,
                  title: "Actionable Insights",
                  desc: "Get context-aware, line-by-line suggestions on how to resolve identified code smells."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Simple, powerful workflow
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-8 text-left">
              {[
                { step: "01", title: "Connect Repo", desc: "Link your GitHub repository or upload raw code files securely." },
                { step: "02", title: "Run Analysis", desc: "Our engine scans your code for hundreds of known issue patterns." },
                { step: "03", title: "Fix & Merge", desc: "Review the actionable report and merge high-quality code." }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="text-5xl font-extrabold text-gray-100 dark:text-gray-800/50 mb-4 tracking-tighter">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600 dark:text-indigo-500" size={24} />
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              CodeGuard
            </span>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link to="/docs" className="hover:text-gray-900 dark:hover:text-white transition-colors">Documentation</Link>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} CodeGuard Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
