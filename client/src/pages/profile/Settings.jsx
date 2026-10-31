import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { sendPasswordResetEmail } from "firebase/auth";
import auth from "../../provider/firebase.config";
import useBloodGroupList from "../../hooks/data/useBloodGroupList";
import {
  useGetUserByEmailQuery,
  useSetUpdateUserMutation,
} from "../../redux/feature/api/userApi";
import { setUser } from "../../redux/feature/user/userSlice";

const Settings = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bloodGroupList] = useBloodGroupList();

  const storeUser = useSelector((state) => state.userStore);
  const { data: dbUserData, isLoading: isUserLoading } = useGetUserByEmailQuery(
    storeUser?.email,
    { skip: !storeUser?.email }
  );

  const [updateUserMutation, { isLoading: isUpdating }] =
    useSetUpdateUserMutation();

  const user = dbUserData?.data || storeUser;
  const [previewPhoto, setPreviewPhoto] = useState(user?.photo || "");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(
    user?.bloodGroup || ""
  );
  const [isSendingReset, setIsSendingReset] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      mobile: user?.mobile || "",
      photoURL: user?.photo || "",
      address: user?.address || "",
    },
  });

  const photoInput = watch("photoURL");

  // Keep form fields synced when DB data loads
  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("mobile", user.mobile || "");
      setValue("photoURL", user.photo || "");
      setValue("address", user.address || "");
      setPreviewPhoto(user.photo || "");
      setSelectedBloodGroup(user.bloodGroup || "");
    }
  }, [user, setValue]);

  // Update photo preview on input change
  useEffect(() => {
    if (photoInput) {
      setPreviewPhoto(photoInput);
    }
  }, [photoInput]);

  const onSubmit = async (formData) => {
    const updatedInfo = {
      name: formData.name?.trim(),
      mobile: formData.mobile?.trim(),
      photo: formData.photoURL?.trim() || user?.photo || "",
      address: formData.address?.trim() || "",
      bloodGroup: selectedBloodGroup || user?.bloodGroup || "",
      showRoom: user?.showRoom || "",
      designation: user?.designation || "",
      isUpdated: true,
    };

    try {
      const res = await updateUserMutation({
        email: user?.email,
        userInfo: updatedInfo,
      }).unwrap();

      dispatch(
        setUser({
          ...user,
          ...updatedInfo,
        })
      );

      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে",
        life: 2500,
      });

      setTimeout(() => {
        navigate("/profile/view");
      }, 1200);
    } catch (err) {
      console.error("Profile update error:", err);
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: err?.data?.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে",
        life: 3000,
      });
    }
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.current.show({
        severity: "success",
        summary: "পাসওয়ার্ড রিসেট ইমেইল প্রেরিত",
        detail: `${user.email} ঠিকানায় পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে`,
        life: 4000,
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: error?.message || "পাসওয়ার্ড রিসেট ইমেইল পাঠাতে সমস্যা হয়েছে",
        life: 3500,
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Toast ref={toast} />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link to="/dashboard" className="hover:text-blue-600">
              ড্যাশবোর্ড
            </Link>
            <span>/</span>
            <Link to="/profile/view" className="hover:text-blue-600">
              প্রোফাইল
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-semibold">সেটিংস ও এডিট</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            প্রোফাইল সেটিংস ও সম্পাদনা
          </h1>
          <p className="text-xs text-gray-500">
            আপনার ব্যক্তিগত তথ্য, ছবি ও অ্যাকাউন্ট নিরাপত্তা পরিচালনা করুন
          </p>
        </div>

        <Link
          to="/profile/view"
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
          <span>প্রোফাইলে ফিরুন</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Avatar & Basic Information */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
              ১
            </span>
            <h2 className="text-base font-bold text-gray-900">
              ব্যক্তিগত তথ্য (Personal Information)
            </h2>
          </div>

          {/* Photo Preview & URL */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-xl bg-gray-50/70 border border-gray-100">
            <div className="relative shrink-0">
              {previewPhoto ? (
                <img
                  src={previewPhoto}
                  alt={user?.name || "Preview"}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
                  onError={() => setPreviewPhoto("")}
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl border-2 border-white shadow-md bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center">
                  {(user?.name || "U")[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 w-full space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                প্রোফাইল ছবি URL (Photo Image Link)
              </label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                {...register("photoURL")}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
              <p className="text-[11px] text-gray-400">
                সরাসরি কোনো ছবির ওয়েব লিংক (URL) দিন। পরিবর্তন সাথে সাথে প্রিভিউ হবে।
              </p>
            </div>
          </div>

          {/* Name & Mobile & Blood Group Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                পূর্ণ নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="আপনার নাম"
                {...register("name", { required: "নাম আবশ্যক" })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
              {errors.name && (
                <span className="text-[11px] text-red-500 mt-1 block">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                মোবাইল নম্বর <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="017XXXXXXXX"
                {...register("mobile", { required: "মোবাইল নম্বর আবশ্যক" })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
              {errors.mobile && (
                <span className="text-[11px] text-red-500 mt-1 block">
                  {errors.mobile.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                রক্তের গ্রুপ (Blood Group)
              </label>
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
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

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                ঠিকানা (Address)
              </label>
              <textarea
                rows={2}
                placeholder="বর্তমান বা স্থায়ী ঠিকানা..."
                {...register("address")}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Official Assignment (Read-only for staff) */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs">
              ২
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                প্রাতিষ্ঠানিক পদবী ও শোরুম (Official Assignment)
              </h2>
              <p className="text-[11px] text-gray-400">
                এই তথ্যগুলো শুধুমাত্র প্রধান কার্যালয়ের অ্যাডমিন দ্বারা পরিবর্তনযোগ্য।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-[11px] text-gray-400 block mb-0.5">নিযুক্ত শোরুম</span>
              <p className="text-xs sm:text-sm font-semibold text-gray-800">
                {user?.showRoom || "বরাদ্দ নেই"}
              </p>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-[11px] text-gray-400 block mb-0.5">প্রাতিষ্ঠানিক পদবী</span>
              <p className="text-xs sm:text-sm font-semibold text-gray-800">
                {user?.designation || "স্টাফ"}
              </p>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-[11px] text-gray-400 block mb-0.5">সিস্টেম রোল (Role)</span>
              <p className="text-xs sm:text-sm font-semibold text-gray-800 capitalize">
                {user?.userType || "Staff"}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Account & Security */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-50 text-amber-600 font-bold text-xs">
              ৩
            </span>
            <h2 className="text-base font-bold text-gray-900">
              অ্যাকাউন্ট ও নিরাপত্তা সেটিংস (Security)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                লগইন ইমেইল (অপরিবর্তনীয়)
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-900">পাসওয়ার্ড পরিবর্তন</p>
                <p className="text-[11px] text-amber-700">
                  আপনার ইমেইলে রিসেট লিংক পাঠানো হবে
                </p>
              </div>

              <button
                type="button"
                onClick={handleSendPasswordReset}
                disabled={isSendingReset}
                className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-200/80 hover:bg-amber-300/80 rounded-lg transition-all shrink-0 disabled:opacity-60"
              >
                {isSendingReset ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
              </button>
            </div>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/profile/view"
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
          >
            বাতিল করুন
          </Link>

          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-xl shadow-sm transition-all disabled:opacity-60"
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
                <span>আপডেট হচ্ছে...</span>
              </>
            ) : (
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
