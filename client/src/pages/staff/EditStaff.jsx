import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import useBloodGroupList from "../../hooks/data/useBloodGroupList";
import { useGetShowroomQuery } from "../../redux/feature/api/showroomApi";
import useDesignationList from "../../hooks/data/useDesignationList";
import {
  useGetUserByEmailQuery,
  useSetUpdateUserMutation,
} from "../../redux/feature/api/userApi";
import Loading from "../../components/shared/Loading";

const EditStaff = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { email } = useParams();

  const { userType: currentUserType } = useSelector((state) => state.userStore);

  const [bloodGroupList] = useBloodGroupList();
  const [designationList] = useDesignationList();
  const { data: showRooms, isLoading: isShowroomLoading } = useGetShowroomQuery();
  const { data: userData, isLoading: isUserLoading } = useGetUserByEmailQuery(email);
  const [setUser, { isLoading: isUpdating, isSuccess, isError, error }] =
    useSetUpdateUserMutation();

  const [designation, setDesignation] = useState(null);
  const [bloodGroup, setBloodGroup] = useState(null);
  const [showRoom, setShowRoom] = useState(null);
  const [userRole, setUserRole] = useState("user");

  const user = userData?.data;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Pre-populate selects & role
  useEffect(() => {
    if (user) {
      setUserRole(user.userType || "user");

      if (bloodGroupList?.length) {
        const bg = bloodGroupList.find(
          (b) => b.code === user.bloodGroup || b.name === user.bloodGroup
        );
        if (bg) setBloodGroup(bg);
      }
      if (designationList?.length) {
        const des = designationList.find(
          (d) => d.code === user.designation || d.name === user.designation
        );
        if (des) setDesignation(des);
      }
      if (showRooms?.length) {
        const sr = showRooms.find(
          (s) => s.name === user.showRoom || s.code === user.showRoom
        );
        if (sr) setShowRoom(sr);
      }
    }
  }, [user, bloodGroupList, designationList, showRooms]);

  const onSubmit = (formData) => {
    // Only admin can change userType and approve
    const userInfo = {
      name: formData.name.trim(),
      photo: formData.photoURL?.trim() || user?.photo || "",
      mobile: formData.mobile.trim(),
      showRoom: showRoom?.name || user?.showRoom || "",
      designation: designation?.code || designation?.name || user?.designation || "",
      address: formData.address.trim(),
      bloodGroup: bloodGroup?.code || bloodGroup?.name || user?.bloodGroup || "",
      userType: userRole,
      isUpdated: userRole !== "user",
    };

    setUser({ email, userInfo });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "স্টাফ তথ্য ও রোল সফলভাবে আপডেট করা হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate("/staff/view");
      }, 1500);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.error || "স্টাফ তথ্য আপডেট করতে সমস্যা হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, error]);

  if (isUserLoading || isShowroomLoading) return <Loading />;

  // Permission Guard: Only Admin can access EditStaff
  if (currentUserType !== "admin") {
    return (
      <div className="max-w-lg mx-auto my-12 p-8 bg-white rounded-2xl border border-red-200 text-center space-y-4 shadow-sm">
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
        <h2 className="text-xl font-bold text-gray-800">অননুমোদিত অ্যাক্সেস</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          কেবলমাত্র <strong>সিস্টেম অ্যাডমিন</strong> কর্মকর্তা ও স্টাফদের রোল পরিবর্তন এবং অনুমোদন করতে পারবেন।
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
        >
          ড্যাশবোর্ডে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>স্টাফ প্রোফাইল ও ভূমিকা সম্পাদনা</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            কর্মকর্তা ও কর্মচারীদের রোল, পদবী, শোরুম শাখা ও ব্যক্তিগত তথ্য নির্ধারণ করুন
          </p>
        </div>
        <Link
          to="/staff/view"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
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
          <span>স্টাফ তালিকা</span>
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
          {/* Section 1: রোল ও অ্যাক্সেস নিয়ন্ত্রণ (Admin Only) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-sky-50/70 border border-blue-200/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200/50">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs">
                  ১
                </span>
                <div>
                  <h2 className="text-base font-bold text-blue-950">
                    অ্যাকাউন্ট ভূমিকা / রোল (Role & Permission)
                  </h2>
                  <p className="text-[11px] text-blue-700">
                    অ্যাডমিন ব্যতীত অন্য কোনো স্টাফ এই রোল পরিবর্তন করতে পারবে না
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>অ্যাডমিন নিয়ন্ত্রণ</span>
              </span>
            </div>

            <div className="pt-1 max-w-xl">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                সিস্টেমের ভূমিকা / রোল (User Role) <span className="text-red-500">*</span>
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-blue-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-semibold text-gray-800 outline-none shadow-sm"
              >
                <option value="user">ব্যবহারকারী — অননুমোদিত (Pending User)</option>
                <option value="staff">স্টাফ — শোরুম ও অপারেশনাল অ্যাক্সেস (Staff)</option>
                <option value="admin">সিস্টেম অ্যাডমিন — সকল পারমিশন (Admin)</option>
              </select>
              <p className="text-[11px] text-gray-500 mt-1.5">
                {userRole === "user" && (
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <span>⚠️</span> অননুমোদিত: এই ইউজার ড্যাশবোর্ডে প্রবেশ করতে পারবে না (Permission পেজে রিডাইরেক্ট হবে)।
                  </span>
                )}
                {userRole === "staff" && (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <span>✓</span> স্টাফ: ড্যাশবোর্ড, সেলস, কাস্টমার, স্টক ও নির্ধারিত শোরুমের কাজ করতে পারবে।
                  </span>
                )}
                {userRole === "admin" && (
                  <span className="text-blue-700 font-bold flex items-center gap-1">
                    <span>★</span> অ্যাডমিন: সম্পূর্ণ সিস্টেম, ইউজার অনুমোদন ও সেটিংস পরিবর্তনের পূর্ণ অনুমতি পাবে।
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Section 2: ব্যক্তিগত তথ্য */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs">
                ২
              </span>
              <h2 className="text-base font-bold text-gray-900">
                ব্যক্তিগত তথ্য (Personal Details)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue={user?.name || ""}
                  placeholder="স্টাফের নাম"
                  {...register("name", { required: "নাম আবশ্যক" })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
                {errors.name && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ইমেইল (অপরিবর্তনীয়)
                </label>
                <input
                  type="email"
                  value={email || user?.email || ""}
                  disabled
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  defaultValue={user?.mobile || ""}
                  placeholder="017XXXXXXXX"
                  {...register("mobile", { required: "মোবাইল নম্বর আবশ্যক" })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
                {errors.mobile && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.mobile.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  রক্তের গ্রুপ (Blood Group)
                </label>
                <select
                  value={bloodGroup?.code || user?.bloodGroup || ""}
                  onChange={(e) => {
                    const found = bloodGroupList?.find((b) => b.code === e.target.value);
                    setBloodGroup(found || (e.target.value ? { code: e.target.value } : null));
                  }}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                >
                  <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
                  {(bloodGroupList || []).map((bg) => (
                    <option key={bg.code} value={bg.code}>
                      {bg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ছবি URL (Photo URL)
                </label>
                <input
                  type="url"
                  defaultValue={user?.photo || ""}
                  placeholder="https://example.com/photo.jpg"
                  {...register("photoURL")}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ঠিকানা <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  defaultValue={user?.address || ""}
                  placeholder="স্থায়ী বা বর্তমান ঠিকানা"
                  {...register("address", { required: "ঠিকানা আবশ্যক" })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                />
                {errors.address && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.address.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: প্রাতিষ্ঠানিক পদবী ও শোরুম */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs">
                ৩
              </span>
              <h2 className="text-base font-bold text-gray-900">
                প্রাতিষ্ঠানিক পদবী ও শোরুম (Official Assignment)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  নিযুক্ত শোরুম <span className="text-red-500">*</span>
                </label>
                <select
                  value={showRoom?.name || user?.showRoom || ""}
                  onChange={(e) => {
                    const found = showRooms?.find((s) => s.name === e.target.value);
                    setShowRoom(found || (e.target.value ? { name: e.target.value } : null));
                  }}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  required
                >
                  <option value="">শোরুম নির্বাচন করুন</option>
                  {(showRooms || []).map((sr) => (
                    <option key={sr.name || sr.code} value={sr.name}>
                      {sr.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  পদবী (Designation) <span className="text-red-500">*</span>
                </label>
                <select
                  value={designation?.code || user?.designation || ""}
                  onChange={(e) => {
                    const found = designationList?.find((d) => d.code === e.target.value);
                    setDesignation(found || (e.target.value ? { code: e.target.value } : null));
                  }}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  required
                >
                  <option value="">পদবী নির্বাচন করুন</option>
                  {(designationList || []).map((des) => (
                    <option key={des.code} value={des.code}>
                      {des.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to="/staff/view"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              বাতিল
            </Link>
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4 text-white"
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
                  <span>সংরক্ষণ করা হচ্ছে...</span>
                </>
              ) : (
                <span>রোল ও তথ্য সংরক্ষণ করুন</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;
