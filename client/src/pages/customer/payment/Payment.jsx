import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import DatePick from "../../../components/shared/DatePick";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import { useGetAccountQuery } from "../../../redux/feature/api/accountApi";
import Loading from "../../../components/shared/Loading";
import {
  useGetSingleCustomerQuery,
  useSetInstallmentMutation,
} from "../../../redux/feature/api/customerApi";

const Payment = () => {
  const toast = useRef(null);
  const [selectedType, setSelectedType] = useState({ name: "নগদ (Cash)", code: "cash" });
  const [date, setDate] = useState(new Date());
  const [coments, setComents] = useState("");
  const navigate = useNavigate();
  const { cardNo } = useParams();

  const { data: singleCustomer, isLoading: isCustomerLoading } = useGetSingleCustomerQuery(cardNo);
  const { name } = useSelector((state) => state.userStore);
  const { data: allAccounts, isLoading: isAccountLoading } = useGetAccountQuery();
  const [setInstallment, { isLoading: isSubmitting, isSuccess, isError, error: insError }] =
    useSetInstallmentMutation();

  const customer = singleCustomer?.data;

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "কিস্তির টাকা সফলভাবে জমা হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate(`/customer/view/${cardNo}`);
      }, 1500);
    }
  }, [isSuccess, navigate, cardNo]);

  useEffect(() => {
    if (isError) {
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: insError?.data?.message || insError?.error || "কিস্তি জমা করতে সমস্যা হয়েছে",
        life: 3000,
      });
    }
  }, [isError, insError]);

  if (isCustomerLoading || isAccountLoading) return <Loading />;

  const paymentTypeList = [
    { name: "নগদ (Cash)", code: "cash" },
    ...(allAccounts || []).map((acc) => ({
      name: `${acc.name} (${acc.code})`,
      code: acc.code,
    })),
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const amount = Number(form.amount.value);
    const voucher = form.voucher.value.trim();

    if (!amount || amount <= 0) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "সঠিক কিস্তির টাকার পরিমাণ লিখুন",
        life: 3000,
      });
      return;
    }

    const installmentData = {
      cardNo,
      showroom: customer?.showRoom || "",
      date,
      amount,
      voucher,
      receiver: name || "Admin",
      type: selectedType?.code || "cash",
      coments: coments.trim(),
    };

    setInstallment(installmentData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="pi pi-credit-card text-blue-600 text-xl"></i>
            কিস্তির টাকা জমা গ্রহণ (Collect Installment)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            গ্রাহকের কার্ডে কিস্তির অর্থ প্রাপ্তি ও ভাউচার এন্ট্রি করুন
          </p>
        </div>
        <Link
          to={`/customer/view/${cardNo}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          গ্রাহকের প্রোফাইল
        </Link>
      </div>

      {/* Customer Info Card */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white rounded-xl border border-blue-100 p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">কার্ড নম্বর</span>
            <p className="text-base font-bold text-blue-700 mt-0.5">{customer?.cardno || cardNo}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">গ্রাহকের নাম</span>
            <p className="text-base font-semibold text-gray-900 mt-0.5">{customer?.customerInfo?.name || "N/A"}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">গাড়ির মডেল</span>
            <p className="text-base font-semibold text-gray-900 mt-0.5">{customer?.productInfo?.models || customer?.productInfo?.type || "N/A"}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">চেসিস নম্বর</span>
            <p className="text-base font-mono font-medium text-gray-700 mt-0.5">{customer?.productInfo?.chassis || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-3 mb-2 border-b border-gray-100">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
              <i className="pi pi-money-bill text-xs"></i>
            </span>
            <h2 className="text-base font-semibold text-gray-800">
              কিস্তি আদায়ের বিবরণ (Installment Details)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                জমার তারিখ <span className="text-red-500">*</span>
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
                আদায়কারী কর্মকর্তা (Receiver)
              </label>
              <input
                type="text"
                value={name || "অ্যাডমিন"}
                disabled
                className="w-full px-3.5 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-600 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                জমার মাধ্যম / অ্যাকাউন্ট <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedType?.code || "cash"}
                onChange={(e) => {
                  const found = paymentTypeList.find((item) => item.code === e.target.value);
                  setSelectedType(found || { code: e.target.value, name: e.target.value });
                }}
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                required
              >
                {paymentTypeList.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
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
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold text-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                রশিদ / ভাউচার নম্বর <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="voucher"
                placeholder="ভাউচার বা মানি রিসিট নং"
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-mono"
                required
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                মন্তব্য / নোট
              </label>
              <textarea
                rows={3}
                value={coments}
                onChange={(e) => setComents(e.target.value)}
                placeholder="পেমেন্ট বা কিস্তি সংক্রান্ত কোনো বিশেষ তথ্য..."
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to={`/customer/view/${cardNo}`}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              বাতিল
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <i className="pi pi-spin pi-spinner text-sm"></i>
                  জমা হচ্ছে...
                </>
              ) : (
                <>
                  <i className="pi pi-check text-sm"></i>
                  কিস্তি জমা নিশ্চিত করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
