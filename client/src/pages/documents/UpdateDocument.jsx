import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { useSelector } from "react-redux";
import { useSetUpdateDocumentMutation } from "../../redux/feature/api/customerApi";

export default function UpdateDocument({ data, refetch }) {
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);
  const { name } = useSelector((state) => state.userStore);
  const [setUpdateDoc, { isLoading, isSuccess, isError, error }] =
    useSetUpdateDocumentMutation();
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);

  const documentStatuses = [
    { name: "পেন্ডিং (Pending)", code: "paid" },
    { name: "প্রস্তুত সম্পন্ন (Complete)", code: "complete" },
    { name: "ডেলিভারি সম্পন্ন (Delivered)", code: "delivared" },
  ];

  const handleSubmit = () => {
    if (!status) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "ডকুমেন্ট স্ট্যাটাস নির্বাচন করুন",
        life: 3000,
      });
      return;
    }

    const backData = {
      docDate: new Date(),
      docStatus: status.code,
      staff: name || "Admin",
    };

    setUpdateDoc({ card: data?.cardno, backData });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch && refetch();
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "ডকুমেন্ট স্ট্যাটাস আপডেট হয়েছে",
        life: 2000,
      });
      setVisible(false);
      setTimeout(() => {
        navigate(`/documents`);
      }, 1000);
    }
  }, [isSuccess, navigate, refetch]);

  useEffect(() => {
    if (isError) {
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: error?.data?.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে",
        life: 3000,
      });
    }
  }, [isError, error]);

  return (
    <>
      <Toast ref={toast} />
      <button
        type="button"
        onClick={() => setVisible(true)}
        className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg border border-blue-200 transition-colors"
        title="ডকুমেন্ট স্ট্যাটাস আপডেট"
      >
        <i className="pi pi-file-edit text-sm"></i>
      </button>

      <Dialog
        header={
          <div className="flex items-center gap-2 text-base font-bold text-gray-800">
            <i className="pi pi-file-check text-blue-600"></i>
            ডকুমেন্ট স্ট্যাটাস পরিবর্তন
          </div>
        }
        visible={visible}
        draggable={false}
        onHide={() => setVisible(false)}
        className="w-full max-w-md mx-4"
      >
        <div className="space-y-4 pt-2">
          <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">কার্ড নম্বর:</span>
              <span className="font-bold text-gray-800">{data?.cardno}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">গ্রাহকের নাম:</span>
              <span className="font-semibold text-gray-700">{data?.customerInfo?.name || "N/A"}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              নতুন স্ট্যাটাস নির্বাচন করুন <span className="text-red-500">*</span>
            </label>
            <select
              value={status?.code || ""}
              onChange={(e) => {
                const found = documentStatuses.find((s) => s.code === e.target.value);
                setStatus(found || null);
              }}
              className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              required
            >
              <option value="">স্ট্যাটাস সিলেক্ট করুন</option>
              {documentStatuses.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <i className="pi pi-spin pi-spinner text-xs"></i>
                  আপডেট হচ্ছে...
                </>
              ) : (
                <>
                  <i className="pi pi-check text-xs"></i>
                  সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
