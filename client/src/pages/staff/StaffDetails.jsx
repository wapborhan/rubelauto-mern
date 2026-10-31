import { useEffect } from "react";
import moment from "moment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetUserByEmailQuery } from "../../redux/feature/api/userApi";
import Loading from "../../components/shared/Loading";

const StaffDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramEmail = queryParams.get("email");

  const storeUser = useSelector((state) => state.userStore);
  const targetEmail = paramEmail || storeUser?.email;

  const {
    data: staffData,
    refetch,
    isLoading,
  } = useGetUserByEmailQuery(targetEmail, {
    skip: !targetEmail,
  });

  useEffect(() => {
    if (targetEmail) {
      refetch();
    }
  }, [targetEmail, refetch]);

  const staff = staffData?.data || (targetEmail === storeUser?.email ? storeUser : null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-200 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
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
        <h2 className="text-xl font-bold text-gray-800">কর্মকর্তার তথ্য পাওয়া যায়নি</h2>
        <p className="text-xs text-gray-500">
          প্রদত্ত ইমেইল দিয়ে কোনো কর্মকর্তার তথ্য খুঁজে পাওয়া যায়নি।
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
        >
          পিছনে ফিরে যান
        </button>
      </div>
    );
  }

  const {
    name,
    photo,
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
  } = staff;

  const formattedJoinDate = joinDate
    ? moment(joinDate).format("DD MMMM, YYYY")
    : createdAt
    ? moment(createdAt).format("DD MMMM, YYYY")
    : "উপলব্ধ নয়";

  const isSelf = storeUser?.email === email;
  const editLink = isSelf ? "/profile/edit" : `/staff/edit/${email}`;
  const whatsappUrl = mobile
    ? `https://api.whatsapp.com/send?phone=88${mobile.replace(/^(\+88|0)/, "0")}&text=${encodeURIComponent(`Hello ${name || ""}`)}`
    : `https://api.whatsapp.com/send?phone=8801907093959&text=${encodeURIComponent(`Hello ${name || ""}`)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 print:p-0 print:m-0 print:space-y-4">
      {/* Top Header Actions (hidden on print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link to="/dashboard" className="hover:text-blue-600">
              ড্যাশবোর্ড
            </Link>
            <span>/</span>
            <Link to="/staff/view" className="hover:text-blue-600">
              স্টাফ তালিকা
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-semibold">স্টাফ বিবরণী</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            কর্মকর্তা ও স্টাফ বিবরণী
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-gray-500"
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
            <span>পিছনে</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            <span>প্রিন্ট করুন</span>
          </button>

          <Link
            to={editLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
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
            <span>তথ্য সম্পাদনা</span>
          </Link>
        </div>
      </div>

      {/* Official Staff Sheet / ID Card Container */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden print:border-none print:shadow-none">
        {/* Banner with Company Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-6 text-white relative">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold block">
                রূবেল অটো ম্যানেজমেন্ট সিস্টেম
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                অফিসিয়াল স্টাফ পরিচিতিপত্র
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                Authorized Dealer • Runner Automobiles PLC
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white capitalize">
                {userType || "Staff"}
              </span>
              <p className="text-[11px] text-blue-200 mt-1">
                {showRoom ? `শোরুম: ${showRoom}` : "শাখা বরাদ্দ নেই"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Identity Bar */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative shrink-0">
              {photo ? (
                <img
                  src={photo}
                  alt={name || "Staff"}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-3xl flex items-center justify-center">
                  {(name || "U")[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-bold text-gray-900">{name || "—"}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {isUpdated ? "সক্রিয় ও ভেরিফাইড" : "সক্রিয়"}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-600">
                {designation || "পদবী নির্ধারিত নেই"}
              </p>
              <p className="text-xs text-gray-400">{email}</p>

              {/* Quick Contact Buttons (hidden on print) */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 print:hidden">
                {mobile && (
                  <a
                    href={`tel:${mobile}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
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
                    <span>কল করুন ({mobile})</span>
                  </a>
                )}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M20.5 3.4A12.1 12.1 0 0012 0 12 12 0 001.7 17.8L0 24l6.3-1.7c2.8 1.5 5 1.4 5.8 1.5a12 12 0 008.4-20.3z"
                      fill="#25D366"
                    />
                  </svg>
                  <span>হোয়াটসঅ্যাপ মেসেজ</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info Box */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
              ব্যক্তিগত তথ্যসমূহ
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">পুরো নাম:</span>
                <span className="font-semibold text-gray-800 text-right">{name || "—"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">মোবাইল নম্বর:</span>
                <span className="font-semibold text-gray-800 text-right">{mobile || "—"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">ইমেইল:</span>
                <span className="font-semibold text-gray-800 text-right">{email || "—"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">রক্তের গ্রুপ:</span>
                <span className="font-bold text-red-600 text-right">
                  {bloodGroup ? (
                    <span className="px-2 py-0.5 rounded bg-red-50 border border-red-200">
                      {bloodGroup}
                    </span>
                  ) : (
                    "—"
                  )}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-400">ঠিকানা:</span>
                <span className="font-semibold text-gray-800 text-right max-w-[65%]">
                  {address || "ঠিকানা অন্তর্ভুক্ত করা হয়নি"}
                </span>
              </div>
            </div>
          </div>

          {/* Official & Employment Box */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
              চাকুরি ও শাখা পদায়ন
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">নিযুক্ত শোরুম:</span>
                <span className="font-bold text-blue-700 text-right">
                  {showRoom || "বরাদ্দ নেই"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">পদবী:</span>
                <span className="font-semibold text-gray-800 text-right">
                  {designation || "স্টাফ"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">সিস্টেম ভূমিকা:</span>
                <span className="font-semibold text-gray-800 text-right capitalize">
                  {userType || "Staff"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">যোগদানের তারিখ:</span>
                <span className="font-semibold text-gray-800 text-right">
                  {formattedJoinDate}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-400">প্রোফাইল স্ট্যাটাস:</span>
                <span className="font-semibold text-emerald-700 text-right">
                  {isUpdated ? "সম্পূর্ণ অনুমোদিত" : "সক্রিয়"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-[11px] text-gray-400">
          রূবেল অটো (Rubel Auto) • প্রধান কার্যালয়: যশোর • হেল্পলাইন: 01907-093959
        </div>
      </div>
    </div>
  );
};

export default StaffDetails;
