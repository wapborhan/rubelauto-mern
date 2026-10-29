import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useGetSupplierQuery } from "../../redux/feature/api/supplierApi";
import { useSetpartsPurchaseMutation } from "../../redux/feature/api/purchaseApi";
import DatePick from "../../components/shared/DatePick";

const PartsPurchase = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { data: allSupplier, isLoading: isSupplierLoading } = useGetSupplierQuery();
  const [setPartsPurchase, { isLoading, isSuccess, isError, error }] =
    useSetpartsPurchaseMutation();

  const [memoDate, setMemoDate] = useState(new Date());
  const [receiveDate, setReceiveDate] = useState(new Date());
  const [supplier, setSupplier] = useState(null);

  const partsSuppliers = (allSupplier?.data || []).filter(
    (item) => item?.prodType === "Parts" || item?.prodType === "All" || !item?.prodType
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    if (!supplier) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "অনুগ্রহ করে সরবরাহকারী নির্বাচন করুন",
        life: 3000,
      });
      return;
    }

    const amount = Number(form.amount.value);
    if (!amount || amount <= 0) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "সঠিক ক্রয়ের পরিমাণ (টাকা) লিখুন",
        life: 3000,
      });
      return;
    }

    const inputData = {
      supplierId: supplier?._id,
      supplier: supplier?._id,
      memoDate,
      MemoNo: form.MemoNo.value.trim(),
      amount,
      transport: form.transport.value.trim(),
      notes: form.notes.value.trim(),
      receiveDate,
    };

    setPartsPurchase(inputData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "পার্টস ক্রয়ের হিসাব সফলভাবে সম্পন্ন হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate("/purchase/parts/view");
      }, 1500);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.error || "পার্টস ক্রয় সংরক্ষণ করতে সমস্যা হয়েছে";
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
            <i className="pi pi-wrench text-blue-600 text-xl"></i>
            পার্টস ক্রয় এন্ট্রি (Parts Purchase)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            সরবরাহকারীর নিকট থেকে যন্ত্রাংশ ক্রয়ের মেমো ও বিবরণ সংরক্ষণ করুন
          </p>
        </div>
        <Link
          to="/purchase/parts/view"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          পার্টস ক্রয়ের তালিকা
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Section 1: মেমো ও সরবরাহকারী বিবরণী */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ১
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                চালান ও সরবরাহকারীর তথ্য (Invoice & Supplier Info)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  সরবরাহকারী নির্বাচন করুন <span className="text-red-500">*</span>
                </label>
                <select
                  value={supplier?._id || ""}
                  onChange={(e) => {
                    const found = partsSuppliers.find(
                      (item) => item._id === e.target.value
                    );
                    setSupplier(found || null);
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                >
                  <option value="">সরবরাহকারী নির্বাচন করুন</option>
                  {partsSuppliers.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.bssName} ({item.empName} - {item.mobile})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  মেমো নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="MemoNo"
                  placeholder="মেমো নং লিখুন"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  মোট ক্রয়ের পরিমাণ (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  min="1"
                  step="any"
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold text-blue-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: ডেলিভারি ও পরিবহন বিবরণী */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ২
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                ডেলিভারি ও পরিবহন বিবরণ (Delivery & Transport)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  মেমো তারিখ <span className="text-red-500">*</span>
                </label>
                <DatePick
                  dateValue={memoDate}
                  setDateValue={setMemoDate}
                  iconShow={false}
                  endDate={9999}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  পণ্য গ্রহণের তারিখ <span className="text-red-500">*</span>
                </label>
                <DatePick
                  dateValue={receiveDate}
                  setDateValue={setReceiveDate}
                  iconShow={false}
                  endDate={9999}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  পরিবহন মাধ্যম / কুরিয়ার
                </label>
                <input
                  type="text"
                  name="transport"
                  placeholder="যেমন: এস এ পরিবহন / সুন্দরবন"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  মন্তব্য / বিস্তারিত নোট
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="পার্টসের নাম, সংখ্যা বা অন্যান্য প্রয়োজনীয় মন্তব্য..."
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to="/purchase/parts/view"
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
                  ক্রয় সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartsPurchase;
