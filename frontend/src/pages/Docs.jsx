import { Key, Shield, Info, Settings } from "lucide-react";

export default function Docs() {
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 gap-12">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Documentation
          </h3>
          <nav className="space-y-1">
            <a href="#introduction" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700 dark:bg-indigo-900/50 dark:text-indigo-200">
              <Info size={18} />
              Introduction
            </a>
            <a href="#github-token" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors">
              <Key size={18} />
              GitHub Token
            </a>
            <a href="#how-it-works" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors">
              <Shield size={18} />
              How Scoring Works
            </a>
            <a href="#advanced" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors">
              <Settings size={18} />
              Advanced Analysis
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl prose prose-blue dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-indigo-400">
        <section id="introduction" className="mb-16 scroll-mt-24">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            CodeGuard Documentation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Welcome to CodeGuard. Our platform provides deep static analysis and quality insights for your GitHub repositories. 
            Follow this guide to get started and learn how to extract the maximum value out of CodeGuard.
          </p>
          <hr className="border-gray-200 dark:border-gray-800" />
        </section>

        <section id="github-token" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-indigo-900/50 rounded-lg shadow-sm border border-blue-200 dark:border-indigo-800/50">
              <Key className="text-blue-600 dark:text-indigo-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
              Generating a GitHub Token
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            To analyze private repositories or bypass rate limits for public ones, CodeGuard requires a GitHub Personal Access Token (PAT).
          </p>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white m-0">Step-by-Step Guide</h3>
            </div>
            <div className="p-6">
              <ol className="list-decimal list-outside ml-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="pl-2">Log in to your GitHub account and go to <strong>Settings</strong>.</li>
                <li className="pl-2">Scroll down the left sidebar and click on <strong>Developer settings</strong>.</li>
                <li className="pl-2">In the left sidebar, click <strong>Personal access tokens</strong>, then select <strong>Tokens (classic)</strong>.</li>
                <li className="pl-2">Click the <strong>Generate new token</strong> button (select "Generate new token (classic)").</li>
                <li className="pl-2">Give your token a descriptive name, like "CodeGuard Analysis".</li>
                <li className="pl-2">Set an expiration date based on your preference (e.g., 30 days).</li>
                <li className="pl-2">Under scopes, select the <strong>repo</strong> scope. This grants full control of private repositories needed to read commits and code.</li>
                <li className="pl-2">Scroll to the bottom and click <strong>Generate token</strong>.</li>
                <li className="pl-2"><strong>Copy the token immediately.</strong> You won't be able to see it again!</li>
              </ol>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg shadow-sm border border-purple-200 dark:border-purple-800/50">
              <Shield className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
              How Scoring Works
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            CodeGuard uses advanced static analysis to provide a comprehensive quality score out of 100. The score is aggregated from several metrics:
          </p>
          <ul className="space-y-4 text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>
              <strong className="text-gray-900 dark:text-white">Cyclomatic Complexity:</strong> Measures the number of linearly independent paths through the source code. Lower is better.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Duplication:</strong> The percentage of duplicate code blocks across your codebase. We penalize heavily for duplication above 5%.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Style Issues:</strong> Linter violations, formatting inconsistencies, and deviations from best practices.
            </li>
          </ul>
        </section>

        <section id="advanced" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg shadow-sm border border-green-200 dark:border-green-800/50">
              <Settings className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
              Advanced Analysis
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            If you need deeper insights, you can customize the branches and the number of commits analyzed in the Repo Quality tab. Analyzing more commits gives a better picture of the repository's long-term health and technical debt trends, though it may take slightly longer to process.
          </p>
        </section>
      </main>
    </div>
  );
}
