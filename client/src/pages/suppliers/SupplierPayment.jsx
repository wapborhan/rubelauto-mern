import { Toast } from "primereact/toast";
import DatePick from "../../components/shared/DatePick";
import Loading from "../../components/shared/Loading";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  useGetSingleSupplierQuery,
  useSetSupplierPaymentMutation,
} from "../../redux/feature/api/supplierApi";

const SupplierPayment = () => {
  const toast = useRef(null);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [selectedMethod, setSelectedMethod] = useState({ name: "নগদ (Cash)", code: "cash" });

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: supplierData,
    isLoading: isSupplierLoading,
  } = useGetSingleSupplierQuery(id);
  const [setPayment, { isLoading, isSuccess, isError, error: payError }] =
    useSetSupplierPaymentMutation();

  const supplier = supplierData?.data;

  const paymentTypeList = [
    { name: "নগদ (Cash)", code: "cash" },
    { name: "ব্যাঙ্ক ট্রান্সফার (Bank Transfer)", code: "bank" },
    { name: "মোবাইল ব্যাংকিং (bKash/Nagad/Rocket)", code: "mobile" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const amount = Number(form.amount.value);

    if (!amount || amount <= 0) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "সঠিক পেমেন্ট পরিমাণ দিন",
        life: 3000,
      });
      return;
    }

    const paymentData = {
      supplierId: id,
      paymentDate: date,
      payeAccountNumber: form.payeAccountNumber.value.trim(),
      amount,
      notes: notes.trim(),
      payMethod: selectedMethod?.code || "cash",
    };

    setPayment({ id, data: paymentData });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "পেমেন্ট সফলভাবে সম্পন্ন হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate(`/contact/supplier/view/${id}`);
      }, 1500);
    }
  }, [isSuccess, navigate, id]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        payError?.data?.message || payError?.error || "পেমেন্ট সম্পন্ন করতে সমস্যা হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, payError]);

  if (isSupplierLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="pi pi-credit-card text-blue-600 text-xl"></i>
            সরবরাহকারীর পেমেন্ট (Supplier Payment)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            সরবরাহকারীকে বকেয়া পরিশোধ বা অগ্রিম প্রদানের হিসাব এন্ট্রি করুন
          </p>
        </div>
        <Link
          to={`/contact/supplier/view/${id}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          সরবরাহকারী বিবরণী
        </Link>
      </div>

      {/* Supplier Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white rounded-xl border border-blue-100 p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">প্রতিষ্ঠানের নাম</span>
            <p className="text-base font-semibold text-gray-900 mt-0.5">{supplier?.bssName || "N/A"}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">প্রতিনিধির নাম</span>
            <p className="text-base font-semibold text-gray-900 mt-0.5">{supplier?.empName || "N/A"}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">মোবাইল নম্বর</span>
            <p className="text-base font-semibold text-gray-900 mt-0.5">{supplier?.mobile || "N/A"}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">বর্তমান বাকী / স্থিতি</span>
            <p className="text-base font-bold text-red-600 mt-0.5">
              ৳ {supplier?.currentBalance?.toLocaleString() ?? "0"}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-3 mb-2 border-b border-gray-100">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
              <i className="pi pi-wallet text-xs"></i>
            </span>
            <h2 className="text-base font-semibold text-gray-800">
              পেমেন্টের বিবরণ (Payment Details)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                পেমেন্ট তারিখ <span className="text-red-500">*</span>
              </label>
              <DatePick
                dateValue={date}
                setDateValue={setDate}
                iconShow={false}
                endDate={9999}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                পেমেন্ট পদ্ধতি <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedMethod?.code || "cash"}
                onChange={(e) => {
                  const found = paymentTypeList.find((m) => m.code === e.target.value);
                  setSelectedMethod(found || { code: e.target.value });
                }}
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              >
                {paymentTypeList.map((method) => (
                  <option key={method.code} value={method.code}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                টাকার পরিমাণ (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                min="1"
                step="any"
                placeholder="0.00"
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                প্রাপকের অ্যাকাউন্ট / ট্রানজেকশন আইডি
              </label>
              <input
                type="text"
                name="payeAccountNumber"
                placeholder="অ্যাকাউন্ট নং বা চেক/ট্রানজেকশন নং"
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                মন্তব্য / নোট
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="পেমেন্ট সংক্রান্ত কোনো বিবরণ বা মন্তব্য লিখুন..."
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to={`/contact/supplier/view/${id}`}
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
                  প্রক্রিয়াধীন...
                </>
              ) : (
                <>
                  <i className="pi pi-check text-sm"></i>
                  পেমেন্ট জমা দিন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierPayment;
