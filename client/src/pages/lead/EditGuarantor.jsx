import { useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import {
  useGetSingleLeadQuery,
  useSetUpdateLeadMutation,
} from "../../redux/feature/api/leadApi";
import Loading from "../../components/shared/Loading";

const EditGuarantor = () => {
  const toast = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: singleLead, isLoading: isFetching } = useGetSingleLeadQuery(id);
  const [setUpdateLead, { isLoading, isSuccess, isError, error }] =
    useSetUpdateLeadMutation();

  const lead = singleLead?.data;
  const guarantor1 = lead?.guarantor?.[0]?.guarantor1;
  const guarantor2 = lead?.guarantor?.[0]?.guarantor2;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const inputData = {
      guarantor: [
        {
          guarantor1: {
            name: form.gd1name.value.trim(),
            coname: form.gd1coname.value.trim(),
            mobile: form.gd1mobile.value.trim(),
            nid: form.gd1nid.value.trim(),
            address: form.gd1address.value.trim(),
          },
          guarantor2: {
            name: form.gd2name.value.trim(),
            coname: form.gd2coname.value.trim(),
            mobile: form.gd2mobile.value.trim(),
            nid: form.gd2nid.value.trim(),
            address: form.gd2address.value.trim(),
          },
        },
      ],
    };

    setUpdateLead({ id, inputData });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "জামিনদারের তথ্য সফলভাবে আপডেট হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate(`/contact/lead/view/${id}`);
      }, 1500);
    }
  }, [isSuccess, navigate, id]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.error || "জামিনদার তথ্য আপডেট করতে সমস্যা হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, error]);

  if (isFetching) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="pi pi-user-edit text-blue-600 text-xl"></i>
            জামিনদার তথ্য সম্পাদনা (Edit Guarantor)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            গ্রাহক <span className="font-semibold text-gray-800">{lead?.name || "N/A"}</span> ({lead?.number || ""})-এর জামিনদারদের তথ্য সংশোধন করুন
          </p>
        </div>
        <Link
          to={`/contact/lead/view/${id}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          গ্রাহকের বিবরণ
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Guarantor 1 Section */}
          <div className="p-5 bg-gray-50/50 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-200">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs">
                ১
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                প্রথম জামিনদারের বিবরণ (Guarantor 1)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="gd1name"
                  defaultValue={guarantor1?.name || ""}
                  placeholder="প্রথম জামিনদারের নাম"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  পিতা / স্বামীর নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="gd1coname"
                  defaultValue={guarantor1?.coname || ""}
                  placeholder="পিতা বা স্বামীর নাম"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="gd1mobile"
                  defaultValue={guarantor1?.mobile || ""}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  জাতীয় পরিচয়পত্র (NID)
                </label>
                <input
                  type="text"
                  name="gd1nid"
                  defaultValue={guarantor1?.nid || ""}
                  placeholder="NID নম্বর"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ঠিকানা
                </label>
                <input
                  type="text"
                  name="gd1address"
                  defaultValue={guarantor1?.address || ""}
                  placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Guarantor 2 Section */}
          <div className="p-5 bg-gray-50/50 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-200">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs">
                ২
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                দ্বিতীয় জামিনদারের বিবরণ (Guarantor 2)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  নাম
                </label>
                <input
                  type="text"
                  name="gd2name"
                  defaultValue={guarantor2?.name || ""}
                  placeholder="দ্বিতীয় জামিনদারের নাম"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  পিতা / স্বামীর নাম
                </label>
                <input
                  type="text"
                  name="gd2coname"
                  defaultValue={guarantor2?.coname || ""}
                  placeholder="পিতা বা স্বামীর নাম"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  name="gd2mobile"
                  defaultValue={guarantor2?.mobile || ""}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  জাতীয় পরিচয়পত্র (NID)
                </label>
                <input
                  type="text"
                  name="gd2nid"
                  defaultValue={guarantor2?.nid || ""}
                  placeholder="NID নম্বর"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ঠিকানা
                </label>
                <input
                  type="text"
                  name="gd2address"
                  defaultValue={guarantor2?.address || ""}
                  placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to={`/contact/lead/view/${id}`}
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

export default EditGuarantor;
