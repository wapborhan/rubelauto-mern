import { useRouteError, isRouteErrorResponse, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const ErrorPage = ({ notFound = false }) => {
  const error = useRouteError();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const is404 =
    notFound ||
    (isRouteErrorResponse(error) && error.status === 404) ||
    error?.status === 404;

  const errorMessage =
    error?.data?.message ||
    error?.message ||
    error?.statusText ||
    "একটি অপ্রত্যাশিত সিস্টেম ত্রুটি ঘটেছে।";

  const errorStack = error?.stack || (typeof error === "object" ? JSON.stringify(error, null, 2) : String(error));

  const handleCopy = () => {
    navigator.clipboard.writeText(errorStack);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50/50 flex flex-col justify-between items-center p-4 sm:p-6 text-gray-800">
      {/* Top Header Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <img
            src="/images/logo/logo-squire.png"
            alt="Rubel Auto"
            className="h-10 w-auto object-contain rounded-lg shadow-xs"
          />
          <div>
            <h1 className="font-bold text-gray-900 text-base leading-tight">
              রূবেল অটো
            </h1>
            <p className="text-[11px] text-gray-400 leading-tight">
              Runner Automobiles PLC
            </p>
          </div>
        </Link>

        <a
          href="tel:01907093959"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span className="hidden sm:inline">হেল্পলাইন: 01907-093959</span>
        </a>
      </header>

      {/* Center Error Card */}
      <main className="w-full max-w-xl my-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 text-center space-y-6">
          {/* Visual Icon */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-3xl blur-xl opacity-30 ${
                is404 ? "bg-amber-400" : "bg-red-500"
              }`}
            ></div>
            <div
              className={`relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-md ${
                is404
                  ? "bg-amber-50 text-amber-600 border border-amber-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {is404 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Heading and Description */}
          <div className="space-y-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                is404
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {is404 ? "Error 404 • পৃষ্ঠাটি পাওয়া যায়নি" : "সিস্টেম ত্রুটি • System Error"}
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {is404
                ? "দুঃখিত! পৃষ্ঠাটি খুঁজে পাওয়া যায়নি"
                : "কিছু একটা সমস্যা হয়েছে!"}
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
              {is404
                ? "আপনি যে লিংকটি অনুসন্ধান করছেন তা পরিবর্তিত বা মুছে ফেলা হতে পারে। অনুগ্রহ করে ড্যাশবোর্ডে ফিরে যান।"
                : "অ্যাপ্লিকেশনে একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন অথবা ড্যাশবোর্ডে ফিরে যান।"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all active:scale-[0.99]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>ড্যাশবোর্ডে ফিরে যান</span>
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold text-xs sm:text-sm shadow-sm transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>পূর্বের পৃষ্ঠায় যান</span>
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 font-semibold text-xs sm:text-sm transition-all"
              title="পুনরায় লোড করুন"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>রিফ্রেশ</span>
            </button>
          </div>

          {/* Technical Details Toggle (Only for runtime errors, not 404) */}
          {!is404 && error && (
            <div className="pt-4 border-t border-gray-100 text-left">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-[11px] font-semibold text-gray-500 hover:text-gray-800 flex items-center justify-between w-full"
              >
                <span>কারিগরি বিবরণ (Developer Details)</span>
                <span>{showDetails ? "লুকান ▲" : "দেখান ▼"}</span>
              </button>

              {showDetails && (
                <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto relative">
                  <div className="flex items-center justify-between pb-1 mb-2 border-b border-slate-700 text-slate-400">
                    <span>{errorMessage}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-white transition-colors"
                    >
                      {copied ? "কপি হয়েছে!" : "কপি করুন"}
                    </button>
                  </div>
                  <pre className="text-[10px] leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {errorStack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-2">
        © {new Date().getFullYear()} রূবেল অটো (Rubel Auto) • সর্বস্বত্ব সংরক্ষিত
      </footer>
    </div>
  );
};

export default ErrorPage;

