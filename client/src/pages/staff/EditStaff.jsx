import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
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

  const [bloodGroupList] = useBloodGroupList();
  const [designationList] = useDesignationList();
  const { data: showRooms, isLoading: isShowroomLoading } = useGetShowroomQuery();
  const { data: userData, isLoading: isUserLoading } = useGetUserByEmailQuery(email);
  const [setUser, { isLoading: isUpdating, isSuccess, isError, error }] =
    useSetUpdateUserMutation();

  const [designation, setDesignation] = useState(null);
  const [bloodGroup, setBloodGroup] = useState(null);
  const [showRoom, setShowRoom] = useState(null);

  const user = userData?.data;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Pre-populate selects
  useEffect(() => {
    if (user && bloodGroupList?.length) {
      const bg = bloodGroupList.find(
        (b) => b.code === user.bloodGroup || b.name === user.bloodGroup
      );
      if (bg) setBloodGroup(bg);
    }
    if (user && designationList?.length) {
      const des = designationList.find(
        (d) => d.code === user.designation || d.name === user.designation
      );
      if (des) setDesignation(des);
    }
    if (user && showRooms?.length) {
      const sr = showRooms.find(
        (s) => s.name === user.showRoom || s.code === user.showRoom
      );
      if (sr) setShowRoom(sr);
    }
  }, [user, bloodGroupList, designationList, showRooms]);

  const onSubmit = (formData) => {
    const userInfo = {
      name: formData.name.trim(),
      photo: formData.photoURL?.trim() || user?.photo || "",
      mobile: formData.mobile.trim(),
      showRoom: showRoom?.name || user?.showRoom || "",
      designation: designation?.code || designation?.name || user?.designation || "",
      address: formData.address.trim(),
      bloodGroup: bloodGroup?.code || bloodGroup?.name || user?.bloodGroup || "",
      isUpdated: true,
    };

    setUser({ email, userInfo });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "স্টাফ প্রোফাইল সফলভাবে আপডেট করা হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate("/staff");
      }, 1500);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.error || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, error]);

  if (isUserLoading || isShowroomLoading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="pi pi-user-edit text-blue-600 text-xl"></i>
            স্টাফ প্রোফাইল সম্পাদনা (Edit Staff)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            কর্মকর্তা ও কর্মচারীদের পদবি, শোরুম ও ব্যক্তিগত বিবরণ আপডেট করুন
          </p>
        </div>
        <Link
          to="/staff"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          স্টাফ তালিকা
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
          {/* Section 1: ব্যক্তিগত তথ্য */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ১
              </span>
              <h2 className="text-base font-semibold text-gray-800">
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
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
                  className="w-full px-3.5 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none"
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
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                />
                {errors.address && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.address.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: প্রাতিষ্ঠানিক তথ্য */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ২
              </span>
              <h2 className="text-base font-semibold text-gray-800">
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
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
              to="/staff"
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              বাতিল
            </Link>
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <i className="pi pi-spin pi-spinner text-sm"></i>
                  সংরক্ষণ করা হচ্ছে...
                </>
              ) : (
                <>
                  <i className="pi pi-check text-sm"></i>
                  প্রোফাইল আপডেট করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;
