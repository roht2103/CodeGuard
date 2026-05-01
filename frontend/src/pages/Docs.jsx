import { Link } from "react-router-dom";
import { Key, Shield, Settings, Info } from "lucide-react";

export default function Docs() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#0B1120]">
      {/* Sidebar */}
      <aside className="w-full md:w-72 flex-shrink-0 border-r border-gray-200 dark:border-white/10">
        <div className="sticky top-20 p-6 md:p-8">
          <div className="mb-8">
            <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
              Getting Started
            </div>
            <nav className="space-y-1">
              <a href="#introduction" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors">
                <Info size={16} />
                Introduction
              </a>
              <a href="#github-token" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white transition-colors">
                <Key size={16} />
                Create GitHub Token
              </a>
            </nav>
          </div>

          <div className="mb-8">
            <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
              Analysis
            </div>
            <nav className="space-y-1">
              <a href="#how-it-works" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors">
                <Shield size={16} />
                Understanding the Score
              </a>
              <a href="#advanced" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors">
                <Settings size={16} />
                Advanced Analysis
              </a>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl px-6 py-12 md:py-20 md:px-16">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
            Documentation
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Step-by-step guide to using CodeGuard — from setup to interpreting quality scores.
          </p>
        </div>

        <div className="space-y-10">
          {/* Card 1: Intro */}
          <section id="introduction" className="scroll-mt-24 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              1. Introduction to CodeGuard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Welcome to CodeGuard. Our platform provides deep static analysis and quality insights for your GitHub repositories. Follow this guide to get started and learn how to extract the maximum value out of your scans.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-5">
              <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                <span className="font-bold">Note:</span> Your code is analyzed completely in memory and is never stored permanently on our servers.
              </p>
            </div>
          </section>

          {/* Card 2: Token */}
          <section id="github-token" className="scroll-mt-24 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              2. Generate a GitHub Token
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              To analyze private repositories or bypass API rate limits for public ones, CodeGuard requires a GitHub Personal Access Token (PAT).
            </p>
            
            <ul className="space-y-4 text-gray-600 dark:text-gray-400 list-disc list-inside mb-8 ml-2">
              <li>Log in to GitHub and go to Settings {">"} Developer settings.</li>
              <li>Click <strong>Personal access tokens</strong> {">"} <strong>Tokens (classic)</strong>.</li>
              <li>Click <strong>Generate new token (classic)</strong>.</li>
              <li>Under scopes, select the <strong>repo</strong> scope to grant read access.</li>
              <li>Generate and copy the token immediately.</li>
            </ul>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-5">
              <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                <span className="font-bold">Tip:</span> Set a reasonable expiration date (e.g., 30 days) and give your token a clear name like "CodeGuard Analysis".
              </p>
            </div>
          </section>

          {/* Card 3: Scoring */}
          <section id="how-it-works" className="scroll-mt-24 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              3. Understanding the Score
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              CodeGuard aggregates several static analysis metrics into a single Quality Score out of 100:
            </p>
            <div className="space-y-6">
              <div>
                <h4 className="text-gray-900 dark:text-white font-semibold mb-1">Cyclomatic Complexity</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Measures the number of independent paths through your code. Lower is better.</p>
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-semibold mb-1">Duplication</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">The percentage of identical code blocks. We heavily penalize duplication above 5%.</p>
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-semibold mb-1">Style Issues</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Linter violations and formatting inconsistencies.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
