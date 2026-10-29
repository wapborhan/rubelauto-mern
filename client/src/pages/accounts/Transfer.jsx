import { useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import {
  useGetAccountQuery,
  useSetTransferMutation,
} from "../../redux/feature/api/accountApi";
import { useGetShowroomQuery } from "../../redux/feature/api/showroomApi";

const Transfer = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { data: allAccounts, isLoading: isAccountsLoading } = useGetAccountQuery();
  const { data: allShowroom, isLoading: isShowroomsLoading } = useGetShowroomQuery();
  const [setPost, { isLoading, isSuccess, isError, error }] = useSetTransferMutation();

  const [sendMessage, setSendMessage] = useState("");
  const [recMessage, setRecMessage] = useState("");
  const [sendType, setSendType] = useState(null);
  const [receivedType, setReceivedType] = useState(null);

  const handleSelectChange = (e, setType, clearError) => {
    const val = e.target.value;
    if (!val) {
      setType(null);
      return;
    }
    const [groupCode, itemCode] = val.split(":");
    const list = groupCode === "accounts" ? allAccounts : allShowroom;
    const item = list?.find((x) => x.code === itemCode);
    setType(item ? { ...item, groupLabel: groupCode } : null);
    clearError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(e.target.amount.value);

    if (!sendType) {
      setSendMessage("প্রেরক অ্যাকাউন্ট নির্বাচন করুন");
      return;
    }
    if (!receivedType) {
      setRecMessage("প্রাপক অ্যাকাউন্ট নির্বাচন করুন");
      return;
    }

    if (sendType.code === receivedType.code) {
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: "প্রেরক এবং প্রাপক একই অ্যাকাউন্ট হতে পারবে না",
        life: 3000,
      });
      return;
    }

    if (!amount || amount <= 0) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "সঠিক ট্রান্সফার পরিমাণ লিখুন",
        life: 3000,
      });
      return;
    }

    const inputData = {
      sendType,
      amount,
      receivedType,
    };

    setPost(inputData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "টাকা সফলভাবে স্থানান্তর (Transfer) হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate("/account/list");
      }, 1500);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.error || "ট্রান্সফার সম্পন্ন করতে সমস্যা হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, error]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="pi pi-arrows-h text-blue-600 text-xl"></i>
            ব্যালেন্স স্থানান্তর (Transfer Balance)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            অ্যাকাউন্ট ও শোরুমের মধ্যে ব্যালেন্স স্থানান্তর করুন
          </p>
        </div>
        <Link
          to="/account/list"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          অ্যাকাউন্ট তালিকা দেখুন
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Transfer Source & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Sender Box */}
            <div className="p-5 bg-red-50/40 rounded-xl border border-red-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-red-100">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 font-bold text-xs">
                      <i className="pi pi-arrow-up-right text-xs"></i>
                    </span>
                    <h2 className="text-sm font-bold text-gray-800">
                      প্রেরক (Send From)
                    </h2>
                  </div>
                  {sendMessage && (
                    <span className="text-xs font-semibold text-red-600">
                      {sendMessage}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      অ্যাকাউন্ট বা শোরুম নির্বাচন করুন <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={sendType ? `${sendType.groupLabel || "accounts"}:${sendType.code}` : ""}
                      onChange={(e) => handleSelectChange(e, setSendType, setSendMessage)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    >
                      <option value="">যেখান থেকে টাকা পাঠাবেন</option>
                      <optgroup label="ব্যাংক ও ক্যাশ অ্যাকাউন্ট (Accounts)">
                        {(allAccounts || []).map((acc) => (
                          <option key={acc.code} value={`accounts:${acc.code}`}>
                            {acc.name} (স্থিতি: ৳{acc.remainingBalance?.toLocaleString() ?? 0})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="শোরুম ব্যালেন্স (Showrooms)">
                        {(allShowroom || []).map((sr) => (
                          <option key={sr.code} value={`showroom:${sr.code}`}>
                            {sr.name} (স্থিতি: ৳{sr.remainingBalance?.toLocaleString() ?? 0})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {sendType && (
                    <div className="bg-white p-3 rounded-lg border border-red-200/60 mt-3 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-gray-500">নাম:</span>
                        <span className="font-semibold text-gray-800">{sendType.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">কোড:</span>
                        <span className="font-medium text-gray-700">{sendType.code}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-100 pt-1.5">
                        <span className="text-gray-500">বর্তমান স্থিতি:</span>
                        <span className="font-bold text-red-600">
                          ৳ {sendType.remainingBalance?.toLocaleString() ?? 0}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Receiver Box */}
            <div className="p-5 bg-green-50/40 rounded-xl border border-green-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-green-100">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 font-bold text-xs">
                      <i className="pi pi-arrow-down-left text-xs"></i>
                    </span>
                    <h2 className="text-sm font-bold text-gray-800">
                      প্রাপক (Received To)
                    </h2>
                  </div>
                  {recMessage && (
                    <span className="text-xs font-semibold text-red-600">
                      {recMessage}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      অ্যাকাউন্ট বা শোরুম নির্বাচন করুন <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={receivedType ? `${receivedType.groupLabel || "accounts"}:${receivedType.code}` : ""}
                      onChange={(e) => handleSelectChange(e, setReceivedType, setRecMessage)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    >
                      <option value="">যেখানে টাকা জমা হবে</option>
                      <optgroup label="ব্যাংক ও ক্যাশ অ্যাকাউন্ট (Accounts)">
                        {(allAccounts || []).map((acc) => (
                          <option key={acc.code} value={`accounts:${acc.code}`}>
                            {acc.name} (স্থিতি: ৳{acc.remainingBalance?.toLocaleString() ?? 0})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="শোরুম ব্যালেন্স (Showrooms)">
                        {(allShowroom || []).map((sr) => (
                          <option key={sr.code} value={`showroom:${sr.code}`}>
                            {sr.name} (স্থিতি: ৳{sr.remainingBalance?.toLocaleString() ?? 0})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {receivedType && (
                    <div className="bg-white p-3 rounded-lg border border-green-200/60 mt-3 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-gray-500">নাম:</span>
                        <span className="font-semibold text-gray-800">{receivedType.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">কোড:</span>
                        <span className="font-medium text-gray-700">{receivedType.code}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-100 pt-1.5">
                        <span className="text-gray-500">বর্তমান স্থিতি:</span>
                        <span className="font-bold text-green-600">
                          ৳ {receivedType.remainingBalance?.toLocaleString() ?? 0}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Amount Section */}
          <div className="p-5 bg-gray-50/60 rounded-xl border border-gray-200">
            <div className="max-w-md mx-auto space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                স্থানান্তরের পরিমাণ (৳) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  min="1"
                  step="any"
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 text-base font-semibold bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                  BDT
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to="/account/list"
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
                  স্থানান্তর হচ্ছে...
                </>
              ) : (
                <>
                  <i className="pi pi-check text-sm"></i>
                  স্থানান্তর নিশ্চিত করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Transfer;
