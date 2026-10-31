import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { logOutUser, setUser } from "../../redux/feature/user/userSlice";
import {
  useGetUserByEmailQuery,
  useGetUsersQuery,
} from "../../redux/feature/api/userApi";
import Loading from "../../components/shared/Loading";

const Permission = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(false);

  const {
    name,
    email,
    photo,
    mobile,
    showRoom,
    designation,
    bloodGroup,
    userType,
    isLoading,
  } = useSelector((state) => state.userStore);

  const { data: users } = useGetUsersQuery();
  const { refetch: refetchUser } = useGetUserByEmailQuery(email, {
    skip: !email,
  });

  // If already approved (not 'user' type), redirect to dashboard
  useEffect(() => {
    if (!isLoading && email && userType && userType !== "user") {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, email, userType, navigate]);

  // If unauthenticated, redirect to signin
  useEffect(() => {
    if (!isLoading && !email) {
      navigate("/auth", { replace: true });
    }
  }, [isLoading, email, navigate]);

  const handleSignOut = async () => {
    try {
      await dispatch(logOutUser());
      navigate("/auth", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleCheckStatus = async () => {
    if (!email) return;
    setIsChecking(true);
    try {
      const res = await refetchUser();
      const latestUser = res?.data?.data;

      if (latestUser?.userType && latestUser.userType !== "user") {
        dispatch(
          setUser({
            name: latestUser.name || name,
            photo: latestUser.photo || photo,
            email: latestUser.email || email,
            joinDate: latestUser.joinDate || "",
            mobile: latestUser.mobile || "",
            showRoom: latestUser.showRoom || "",
            designation: latestUser.designation || "",
            bloodGroup: latestUser.bloodGroup || "",
            address: latestUser.address || "",
            userType: latestUser.userType,
            isUpdated: latestUser.isUpdated || false,
          }),
        );
        toast.current?.show({
          severity: "success",
          summary: "অভিনন্দন!",
          detail:
            "আপনার অ্যাকাউন্ট সক্রিয় হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...",
          life: 2500,
        });
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1200);
      } else {
        toast.current?.show({
          severity: "info",
          summary: "অপেক্ষমান",
          detail:
            "আপনার অ্যাকাউন্টটি এখনও সক্রিয় করা হয়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।",
          life: 3500,
        });
      }
    } catch (error) {
      console.error("Status check failed:", error);
      toast.current?.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: "স্ট্যাটাস চেক করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।",
        life: 3000,
      });
    } finally {
      setIsChecking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello Admin, I am ${name || "a user"} (${email || ""}). I have registered an account on Rubel Auto portal. Please activate my account.`,
  );
  const whatsappUrl = `https://api.whatsapp.com/send?phone=8801907093959&text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/40 text-gray-800 flex flex-col justify-between">
      <Toast ref={toast} />

      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/images/logo/logo-squire.png"
                alt="Rubel Auto"
                className="h-10 w-auto object-contain rounded"
              />
              <div>
                <h1 className="font-bold text-lg text-gray-900 leading-tight">
                  রূবেল অটো
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Authorized Dealer • Runner Automobiles PLC
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-gray-200 text-right">
              <div>
                <p className="text-xs font-semibold text-gray-700 leading-none">
                  {name || "ইউজার প্রোফাইল"}
                </p>
                <p className="text-[11px] text-gray-400 leading-tight">
                  {email}
                </p>
              </div>
              {photo ? (
                <img
                  src={photo}
                  alt={name || "user"}
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center">
                  {(name || "U")[0].toUpperCase()}
                </div>
              )}
            </div>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-all"
              title="লগআউট করুন"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-center">
        {/* Banner Alert Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
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
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-lg font-bold text-amber-900">
                অ্যাকাউন্ট ভেরিফিকেশন ও সক্রিয়করণ অপেক্ষমান
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-200/70 text-amber-900">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                Inactive / Unapproved
              </span>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              আপনার অ্যাকাউন্টটি সফলভাবে তৈরি হয়েছে, তবে নিরাপত্তা ও
              ব্যবস্থাপনার স্বার্থে অ্যাডমিন কর্তৃক অনুমোদন না দেওয়া পর্যন্ত
              ড্যাশবোর্ড ও অভ্যন্তরীণ ফিচারসমূহ ব্যবহারের অনুমতি দেওয়া যাচ্ছে
              না। অনুগ্রহ করে অ্যাকাউন্ট সক্রিয় করতে অ্যাডমিনের সাথে যোগাযোগ
              করুন।
            </p>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: User Profile & Actions */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Profile Cover & Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 h-28 relative">
              <div className="absolute -bottom-10 left-6">
                {photo ? (
                  <img
                    src={photo}
                    alt={name || "user"}
                    className="w-20 h-20 rounded-2xl border-4 border-white shadow-md object-cover bg-white"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center">
                    {(name || "U")[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-12 px-6 pb-6">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {name || "নাম পাওয়া যায়নি"}
                  </h3>
                  <p className="text-sm text-gray-500">{email}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200">
                  রোল: ব্যবহারকারী (অননুমোদিত)
                </span>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 border-y border-gray-100 text-xs">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block mb-0.5">
                    মোবাইল নম্বর
                  </span>
                  <span className="font-semibold text-gray-800">
                    {mobile || "দেওয়া হয়নি"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block mb-0.5">
                    নিযুক্ত শোরুম
                  </span>
                  <span className="font-semibold text-gray-800">
                    {showRoom || "এখনও নির্ধারিত হয়নি"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block mb-0.5">
                    পদবী (Designation)
                  </span>
                  <span className="font-semibold text-gray-800">
                    {designation || "স্টাফ / ব্যবহারকারী"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block mb-0.5">
                    রক্তের গ্রুপ
                  </span>
                  <span className="font-semibold text-gray-800">
                    {bloodGroup || "দেওয়া হয়নি"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow active:scale-[0.99]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M20.5 3.4A12.1 12.1 0 0012 0 12 12 0 001.7 17.8L0 24l6.3-1.7c2.8 1.5 5 1.4 5.8 1.5a12 12 0 008.4-20.3z"
                      fill="#eceff1"
                    />
                    <path
                      d="M12 21.8c-3.1 0-5.2-1.6-5.4-1.6l-3.7 1 1-3.7-.3-.4A9.9 9.9 0 012.1 12a10 10 0 0117-7 9.9 9.9 0 01-7 16.9z"
                      fill="#25D366"
                    />
                    <path
                      d="M17.5 14.3c-.3 0-1.8-.8-2-.9-.7-.2-.5 0-1.7 1.3-.1.2-.3.2-.6.1s-1.3-.5-2.4-1.5a9 9 0 01-1.7-2c-.3-.6.4-.6 1-1.7l-.1-.5-1-2.2c-.2-.6-.4-.5-.6-.5-.6 0-1 0-1.4.3-1.6 1.8-1.2 3.6.2 5.6 2.7 3.5 4.2 4.2 6.8 5 .7.3 1.4.3 1.9.2.6 0 1.7-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"
                      fill="#fafafa"
                    />
                  </svg>
                  <span>হোয়াটসঅ্যাপে মেসেজ পাঠান</span>
                </a>

                <button
                  type="button"
                  onClick={handleCheckStatus}
                  disabled={isChecking}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-sm transition-all disabled:opacity-60"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`}
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
                  <span>
                    {isChecking
                      ? "যাচাই করা হচ্ছে..."
                      : "স্ট্যাটাস রিফ্রেশ করুন"}
                  </span>
                </button>
              </div>

              {/* Direct Call Option */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>সরাসরি কল করতে পারেন:</span>
                <a
                  href="tel:01907093959"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
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
                  01907-093959
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Steps to Activate & Team Preview */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Steps Guide */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h4 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                অ্যাকাউন্ট সক্রিয় করার ৩টি সহজ ধাপ
              </h4>

              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ১
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800">
                      অ্যাডমিনের সাথে যোগাযোগ করুন
                    </h5>
                    <p className="text-xs text-gray-500 mt-0.5">
                      হোয়াটসঅ্যাপ বাটনে ক্লিক করে বা সরাসরি কল দিয়ে আপনার নাম ও
                      রেজিস্ট্রেশন ইমেইল জানান।
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ২
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800">
                      পদবী ও শোরুম নির্ধারণ
                    </h5>
                    <p className="text-xs text-gray-500 mt-0.5">
                      অ্যাডমিন আপনার তথ্য যাচাই করে পদবী, শোরুম শাখা ও অনুমোদনের
                      অনুমতি প্রদান করবেন।
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ৩
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800">
                      স্ট্যাটাস রিফ্রেশ করুন
                    </h5>
                    <p className="text-xs text-gray-500 mt-0.5">
                      অনুমোদন পাওয়ার পর "স্ট্যাটাস রিফ্রেশ করুন" বাটনে ক্লিক
                      করলে স্বয়ংক্রিয়ভাবে মূল ড্যাশবোর্ডে প্রবেশ করবেন।
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Social Proof / Active Users Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  সিস্টেমের সক্রিয় সদস্যবৃন্দ
                </span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {users?.data?.length || 0} জন কর্মকর্তা
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden py-1">
                  {users?.data && users.data.length > 0 ? (
                    users.data.slice(0, 7).map((u, i) =>
                      u.photo ? (
                        <img
                          key={u.email || i}
                          src={u.photo}
                          alt={u.name || "Member"}
                          title={u.name}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                        />
                      ) : (
                        <div
                          key={u.email || i}
                          title={u.name}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 text-slate-700 font-bold text-[11px]"
                        >
                          {(u.name || "U")[0]}
                        </div>
                      ),
                    )
                  ) : (
                    <span className="text-xs text-gray-400">
                      সদস্য তালিকা লোড হচ্ছে...
                    </span>
                  )}
                </div>

                {users?.data && users.data.length > 7 && (
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    +{users.data.length - 7} জন
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-200 bg-white/50 text-center text-xs text-gray-500">
        <p>
          © {new Date().getFullYear()} রূবেল অটো (Rubel Auto). সর্বস্বত্ব
          সংরক্ষিত।
        </p>
      </footer>
    </div>
  );
};

export default Permission;
