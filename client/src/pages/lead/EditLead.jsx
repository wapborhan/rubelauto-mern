import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import {
  useGetSingleLeadQuery,
  useSetUpdateLeadMutation,
} from "../../redux/feature/api/leadApi";
import Loading from "../../components/shared/Loading";

const EditLead = () => {
  const { id } = useParams();
  const { data: singleLead, isLoading: isFetching } = useGetSingleLeadQuery(id);
  const [setUpdateLead, { isLoading, isSuccess, isError, error }] =
    useSetUpdateLeadMutation();

  const toast = useRef(null);
  const navigate = useNavigate();

  const lead = singleLead?.data;
  const [status, setStatus] = useState("Warm");

  useEffect(() => {
    if (lead?.status) {
      setStatus(lead.status);
    }
  }, [lead]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const inputData = {
      status: status || lead?.status || "Warm",
      name: form.name.value.trim(),
      coname: form.coname.value.trim(),
      nid: form.nid.value.trim(),
      address: form.address.value.trim(),
      number: form.number.value.trim(),
      location: form.location.value.trim(),
      media: form.media.value.trim(),
      guarantor: lead?.guarantor || [],
    };

    setUpdateLead({ id, inputData });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "গ্রাহকের তথ্য সফলভাবে আপডেট হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate("/contact/lead/view");
      }, 1500);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.error || "তথ্য আপডেট করতে ব্যর্থ হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, error]);

  // Safe formatting for existing address if it was saved as an object
  const getFormattedAddress = () => {
    if (!lead?.address) return "";
    if (typeof lead.address === "string") return lead.address;
    if (typeof lead.address === "object") {
      const { village, union, upazila, district, division } = lead.address;
      return [village, union, upazila, district, division].filter(Boolean).join(", ");
    }
    return "";
  };

  if (isFetching) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="pi pi-user-edit text-blue-600 text-xl"></i>
            গ্রাহকের তথ্য সম্পাদনা (Edit Lead)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            গ্রাহকের ব্যক্তিগত, যোগাযোগের এবং আগ্রহের বিবরণ হালনাগাদ করুন
          </p>
        </div>
        <Link
          to="/contact/lead/view"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          গ্রাহক তালিকা দেখুন
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Section 1: প্রাথমিক ও যোগাযোগের তথ্য */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ১
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                ব্যক্তিগত ও যোগাযোগের বিবরণ (Personal & Contact)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  গ্রাহকের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={lead?.name || ""}
                  placeholder="গ্রাহকের পূর্ণ নাম লিখুন"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  পিতা / স্বামীর নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="coname"
                  defaultValue={lead?.coname || ""}
                  placeholder="পিতা বা স্বামীর নাম"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="number"
                  defaultValue={lead?.number || ""}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  জাতীয় পরিচয়পত্র (NID) নম্বর
                </label>
                <input
                  type="text"
                  name="nid"
                  defaultValue={lead?.nid || ""}
                  placeholder="NID নম্বর লিখুন"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  আগ্রহের মাত্রা (Lead Status)
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                >
                  <option value="Hot">🔥 Hot (অতি আগ্রহী)</option>
                  <option value="Warm">⚡ Warm (আগ্রহী)</option>
                  <option value="Cold">❄️ Cold (প্রাথমিক)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  শোরুম / লোকেশন
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={lead?.location || ""}
                  placeholder="যেমন: জামালপুর শোরুম"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  রেফারেন্স / মিডিয়া মাধ্যম
                </label>
                <input
                  type="text"
                  name="media"
                  defaultValue={lead?.media || ""}
                  placeholder="যেমন: ফেসবুক, বন্ধু, সরাসরি ভিজিট ইত্যাদি"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: ঠিকানা */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ২
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                বর্তমান ও স্থায়ী ঠিকানা (Address Details)
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                সম্পূর্ণ ঠিকানা
              </label>
              <textarea
                name="address"
                rows={3}
                defaultValue={getFormattedAddress()}
                placeholder="গ্রাম/রোড, ডাকঘর, থানা/উপজেলা, জেলা"
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to="/contact/lead/view"
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              বাতিল
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="pi pi-spin pi-spinner text-sm"></i>
                  সংরক্ষণ করা হচ্ছে...
                </>
              ) : (
                <>
                  <i className="pi pi-check text-sm"></i>
                  আপডেট সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLead;
