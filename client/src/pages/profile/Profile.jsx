import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import { useGetUserByEmailQuery } from "../../redux/feature/api/userApi";

const Profile = () => {
  const storeUser = useSelector((state) => state.userStore);
  const { data: dbUserData, isLoading } = useGetUserByEmailQuery(storeUser?.email, {
    skip: !storeUser?.email,
  });

  const user = dbUserData?.data || storeUser;

  const {
    photo,
    name,
    email,
    mobile,
    showRoom,
    designation,
    bloodGroup,
    address,
    joinDate,
    userType,
    isUpdated,
    createdAt,
  } = user;

  const formattedJoinDate = joinDate
    ? moment(joinDate).format("DD MMMM, YYYY")
    : createdAt
    ? moment(createdAt).format("DD MMMM, YYYY")
    : "উপলব্ধ নয়";

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            আপনার ব্যক্তিগত ও প্রাতিষ্ঠানিক প্রোফাইল বিবরণী
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span>প্রোফাইল এডিট করুন</span>
          </Link>
        </div>
      </div>

      {/* Hero Profile Banner Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Cover Background */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
          {/* Subtle decorative pattern */}
          <div className="absolute right-6 -bottom-6 opacity-10 pointer-events-none text-white">
            <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
        </div>

        {/* Profile Avatar and Details Bar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {/* Avatar */}
              <div className="relative">
                {photo ? (
                  <img
                    src={photo}
                    alt={name || "User"}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-4xl flex items-center justify-center">
                    {(name || "U")[0].toUpperCase()}
                  </div>
                )}
                <span
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm"
                  title="সক্রিয় একাউন্ট"
                ></span>
              </div>

              {/* Title & Roles */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {name || "অজ্ঞাত ব্যবহারকারী"}
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                    {userType || "Staff"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {designation || "পদবী নির্ধারিত হয়নি"} • {showRoom || "শোরুম বরাদ্দ নেই"}
                </p>
                <p className="text-xs text-gray-400">{email}</p>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {isUpdated ? "ভেরিফাইড প্রোফাইল" : "সক্রিয় একাউন্ট"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Overview Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-400 font-medium">পদবী</p>
            <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">
              {designation || "স্টাফ"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-400 font-medium">শোরুম শাখা</p>
            <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">
              {showRoom || "বরাদ্দ নেই"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-400 font-medium">রক্তের গ্রুপ</p>
            <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">
              {bloodGroup || "জানা নেই"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-400 font-medium">যোগদানের তারিখ</p>
            <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">
              {formattedJoinDate}
            </p>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Personal Details */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <h3 className="font-bold text-gray-900 text-sm">ব্যক্তিগত তথ্য</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-400 font-medium">পূর্ণ নাম</span>
              <span className="font-semibold text-gray-800 text-right">
                {name || "—"}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-400 font-medium">মোবাইল নম্বর</span>
              {mobile ? (
                <a
                  href={`tel:${mobile}`}
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline text-right"
                >
                  {mobile}
                </a>
              ) : (
                <span className="font-semibold text-gray-400">—</span>
              )}
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-400 font-medium">রক্তের গ্রুপ</span>
              <span className="font-semibold text-gray-800 text-right">
                {bloodGroup ? (
                  <span className="inline-block px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold">
                    {bloodGroup}
                  </span>
                ) : (
                  "—"
                )}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5">
              <span className="text-gray-400 font-medium">ঠিকানা</span>
              <span className="font-semibold text-gray-800 text-right max-w-[65%]">
                {address || "ঠিকানা অন্তর্ভুক্ত করা হয়নি"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Official & Employment Details */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </span>
            <h3 className="font-bold text-gray-900 text-sm">
              প্রাতিষ্ঠানিক ও নিয়োগ সংক্রান্ত তথ্য
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-400 font-medium">নিযুক্ত শাখা / শোরুম</span>
              <span className="font-semibold text-gray-800 text-right">
                {showRoom || "বরাদ্দ করা হয়নি"}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-400 font-medium">পদবী (Designation)</span>
              <span className="font-semibold text-gray-800 text-right">
                {designation || "স্টাফ"}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-400 font-medium">সিস্টেম রোল (Role)</span>
              <span className="font-semibold text-gray-800 text-right capitalize">
                {userType || "user"}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5">
              <span className="text-gray-400 font-medium">যোগদানের তারিখ</span>
              <span className="font-semibold text-gray-800 text-right">
                {formattedJoinDate}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Account & Access Details */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
            <h3 className="font-bold text-gray-900 text-sm">
              অ্যাকাউন্ট ও লগইন তথ্য
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block mb-1">লগইন ইমেইল ঠিকানা</span>
              <a
                href={`mailto:${email}`}
                className="font-semibold text-gray-800 hover:text-blue-600 break-all"
              >
                {email}
              </a>
            </div>

            <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block mb-1">প্রোফাইল স্ট্যাটাস</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {isUpdated ? "আপডেটেড ও ভেরিফাইড" : "একটিভ"}
              </span>
            </div>

            <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block mb-1">নিরাপত্তা ও পাসওয়ার্ড</span>
              <Link
                to="/profile/edit"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                পাসওয়ার্ড ও তথ্য আপডেট →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
