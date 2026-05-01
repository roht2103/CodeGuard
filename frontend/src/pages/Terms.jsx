import { FileText, ShieldAlert, AlertTriangle, Scale } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      {/* Hero Section */}
      <div className="relative pt-24 pb-12 border-b border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[800px] rounded-full bg-indigo-500 opacity-10 blur-[100px] pointer-events-none"></div>
        
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-500/20">
            <FileText size={16} />
            <span>Legal Document</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Please read these terms carefully before using the CodeGuard platform. Your access implies your agreement.
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
              <div className="flex-shrink-0 p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                <ShieldAlert size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0">Acceptance</h2>
            </div>
            <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>By accessing or using the CodeGuard service, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
              <p>If you do not agree with any part of these terms, you may not use our services.</p>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0">Usage Rules</h2>
            </div>
            <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>CodeGuard provides deep static code analysis tools. You agree to only analyze repositories that you legally own or have explicit, documented permission to access.</p>
              <p>Any abuse of the system, including attempting to analyze repositories without authorization, will result in immediate and permanent account termination.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                <Scale size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0">Disclaimers</h2>
            </div>
            <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>The service is provided strictly on an "as is" and "as available" basis without any warranties of any kind, either express or implied.</p>
              <p>CodeGuard does not guarantee that the service will be uninterrupted, entirely secure, or perfectly error-free.</p>
            </div>
          </div>
          
          {/* Section 4 */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                <FileText size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0">Liability Limitation</h2>
            </div>
            <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
              <p>In no event shall CodeGuard, its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
              <p>This includes without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
