import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle } from "../../redux/feature/user/userSlice";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { email, userType, isLoading } = useSelector(
    (state) => state.userStore,
  );

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (email && !isLoading) {
      if (userType === "user") {
        navigate("/permission", { replace: true });
      } else {
        navigate(location?.state?.from || "/dashboard", { replace: true });
      }
    }
  }, [email, userType, isLoading, navigate, location?.state?.from]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage("");

    try {
      const result = await dispatch(loginWithGoogle()).unwrap();
      console.log("Google sign-in successful:", result?.email);
    } catch (err) {
      console.error("Google sign in failed:", err);
      if (err?.includes("popup-closed-by-user")) {
        setErrorMessage(
          "লগইন উইন্ডোটি বন্ধ করা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        );
      } else {
        setErrorMessage(
          err || "গুগল দিয়ে সাইন ইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        );
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div
      className="flex items-center min-h-screen  lg:justify-center"
      style={{
        backgroundImage: `url("/images/bg.jpg")`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Brand Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-8 text-white text-center relative">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-md p-2 mx-auto mb-4 flex items-center justify-center">
              <img
                src="/images/logo/logo-squire.png"
                alt="Rubel Auto"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-black tracking-tight">রূবেল অটো</h1>
            <p className="text-xs text-blue-100 mt-1 font-medium">
              Authorized Dealer • Runner Automobiles PLC
            </p>
            <span className="inline-block mt-3 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 border border-white/30 text-white">
              অফিসিয়াল ম্যানেজমেন্ট পোর্টাল
            </span>
          </div>

          {/* Action Body */}
          <div className="p-8 space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-gray-800">
                অ্যাকাউন্টে সাইন ইন করুন
              </h2>
              <p className="text-xs text-gray-500">
                শুধুমাত্র অনুমোদিত গুগল অ্যাকাউন্ট দিয়ে লগইন করুন
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 shrink-0 mt-0.5 text-red-500"
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
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Google Sign In Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 active:scale-[0.99] text-gray-700 font-semibold text-sm shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSigningIn ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>গুগল সংযোগ স্থাপন হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="w-5 h-5 shrink-0"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                    <span>গুগল দিয়ে প্রবেশ করুন (Google Login)</span>
                  </>
                )}
              </button>
            </div>

            {/* Access Policy Note */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-xs text-gray-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>অ্যাক্সেস ও অনুমোদনের নিয়মাবলী</span>
              </div>
              <p className="text-[11px] leading-relaxed text-gray-500">
                নতুন ব্যবহারকারী হিসেবে সাইন ইন করলে আপনার অ্যাকাউন্টটি
                স্বয়ংক্রিয়ভাবে নিবন্ধিত হবে। নিরাপত্তার স্বার্থে প্রধান অ্যাডমিন
                অ্যাকাউন্টটি অনুমোদন ও শাখা নির্ধারণ না করা পর্যন্ত ড্যাশবোর্ড
                ব্যবহারের অনুমতি স্থগিত থাকবে।
              </p>
            </div>

            {/* Contact Helpline */}
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-[11px] text-gray-400">
                সাহায্য প্রয়োজন? কল করুন:{" "}
                <a
                  href="tel:01907093959"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  01907-093959
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
