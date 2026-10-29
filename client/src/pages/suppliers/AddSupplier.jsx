import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetSupplierMutation } from "../../redux/feature/api/supplierApi";
import useProdType from "../../hooks/data/useProdType";

const AddSuplier = () => {
  const toast = useRef(null);
  const [setSupplier, { isLoading, isSuccess, isError, error }] =
    useSetSupplierMutation();
  const [proTypeList] = useProdType();
  const [prodType, setProdType] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const inputData = {
      bssName: form.bssName.value.trim(),
      empName: form.empName.value.trim(),
      prodType: prodType?.name || "",
      email: form.email.value.trim(),
      mobile: form.mobile.value.trim(),
      address: form.address.value.trim(),
      bssLogoUrl: form.bssLogoUrl.value.trim(),
      openingBalance: Number(form.openingBalance.value) || 0,
      addedDate: new Date(),
    };

    setSupplier(inputData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "নতুন সরবরাহকারী সফলভাবে যোগ করা হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate("/contact/supplier/view");
      }, 1500);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.error || "সরবরাহকারী যোগ করতে সমস্যা হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, error]);

  return (
    <div className="max-w-5xl mx-auto">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="pi pi-users text-blue-600 text-xl"></i>
            সরবরাহকারী যোগ করুন (Add Supplier)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            কোম্পানির তথ্য, প্রতিনিধির নাম এবং যোগাযোগের বিবরণ পূরণ করুন
          </p>
        </div>
        <Link
          to="/contact/supplier/view"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          সরবরাহকারী তালিকা দেখুন
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Section 1: প্রতিষ্ঠানের তথ্য */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ১
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                প্রতিষ্ঠানের বিবরণ (Business Information)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  প্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bssName"
                  placeholder="যেমন: ইউনিক মোটরস"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ব্যবসার ধরণ
                </label>
                <select
                  value={prodType?.name || ""}
                  onChange={(e) => {
                    const found = proTypeList?.find(
                      (item) => item.name === e.target.value
                    );
                    setProdType(
                      found || (e.target.value ? { name: e.target.value } : null)
                    );
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                >
                  <option value="">ব্যবসার ধরণ নির্বাচন করুন</option>
                  {(proTypeList || []).map((type) => (
                    <option key={type.name || type.sku} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ওপেনিং ব্যালেন্স (৳)
                </label>
                <input
                  type="number"
                  name="openingBalance"
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  প্রতিষ্ঠানের লোগো URL
                </label>
                <input
                  type="url"
                  name="bssLogoUrl"
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: প্রতিনিধি ও যোগাযোগের তথ্য */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ২
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                প্রতিনিধি ও যোগাযোগ (Representative & Contact)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  প্রতিনিধি / কর্মচারীর নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="empName"
                  placeholder="প্রতিনিধির নাম"
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
                  name="mobile"
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ইমেইল অ্যাড্রেস
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ঠিকানা
                </label>
                <textarea
                  name="address"
                  rows={2}
                  placeholder="ঠিকানা ও বিস্তারিত লোকেশন"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to="/contact/supplier/view"
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
                  সরবরাহকারী সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSuplier;
