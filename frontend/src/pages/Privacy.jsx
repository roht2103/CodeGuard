import { Shield, Eye, Lock, RefreshCw } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      {/* Hero Section */}
      <div className="relative pt-24 pb-12 border-b border-gray-200 dark:border-white/10 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Glowing orb */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[800px] rounded-full bg-blue-500 opacity-10 blur-[100px] pointer-events-none"></div>
        
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 border border-blue-100 dark:border-blue-500/20">
            <Shield size={16} />
            <span>Legal Document</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            We are committed to protecting your personal information and your right to privacy. Transparency is built into everything we do.
          </p>
          <div className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Last updated: May 2026
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-6 mt-10 md:mt-12">
        <div className="flex flex-col space-y-10 md:space-y-12">
          {/* Section 1 */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <Eye size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0">Data Collection</h2>
            </div>
            <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>We only collect the information absolutely necessary to provide our service. This is primarily limited to the GitHub tokens you provide for analysis, and basic account information such as your email address.</p>
              <p>We do not use tracking cookies, nor do we monitor your browsing activity outside of our application. Your privacy is paramount.</p>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <Shield size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0">Data Usage</h2>
            </div>
            <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>Your GitHub token is used exclusively to fetch repository data for static analysis. We do not store your token beyond the active session or analysis execution unless explicitly saved in your settings.</p>
              <p>Your data is <strong>never</strong> sold, rented, or shared with third parties for marketing purposes.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <Lock size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0">Security Standards</h2>
            </div>
            <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>We implement strict, industry-standard security measures to protect your data. All communication is encrypted via modern HTTPS/TLS protocols.</p>
              <p>Analysis results are securely stored in our isolated, access-controlled databases that are regularly audited for vulnerabilities.</p>
            </div>
          </div>
          
          {/* Section 4 */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <RefreshCw size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0">Policy Updates</h2>
            </div>
            <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal obligations.</p>
              <p>We will notify you of any significant changes by directly emailing you and updating the effective date at the top of this page.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
