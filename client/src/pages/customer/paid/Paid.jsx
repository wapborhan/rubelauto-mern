import { useNavigate, useParams, Link } from "react-router-dom";
import PaidForm from "./PaidForm";
import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import {
  useGetSingleCustomerQuery,
  useSetPaidCustomerMutation,
} from "../../../redux/feature/api/customerApi";
import Loading from "../../../components/shared/Loading";

const Paid = () => {
  const { cardNo } = useParams();
  const { data: singleCustomer, isLoading } = useGetSingleCustomerQuery(cardNo);
  const [setPost, { isLoading: isSubmitting, isSuccess, isError, error }] =
    useSetPaidCustomerMutation();
  const navigate = useNavigate();
  const toast = useRef(null);

  const customer = singleCustomer?.data;

  const postData = (data) => {
    setPost({ cardNo, data });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: `কার্ড নং ${cardNo} সফলভাবে পরিশোধিত তালিকায় যুক্ত হয়েছে`,
        life: 2000,
      });
      setTimeout(() => {
        navigate(`/documents`);
      }, 1500);
    }
  }, [isSuccess, navigate, cardNo]);

  useEffect(() => {
    if (isError) {
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: error?.data?.message || "পরিশোধিত তালিকায় যুক্ত করতে সমস্যা হয়েছে",
        life: 3000,
      });
    }
  }, [isError, cardNo, error]);

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="pi pi-check-circle text-emerald-600 text-xl"></i>
            পরিশোধিত তালিকাভুক্তকরণ (Mark as Paid)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            গ্রাহকের সমস্ত কিস্তি ও বকেয়া পরিশোধ সম্পন্ন হলে পরিশোধিত স্ট্যাটাসে স্থানান্তর করুন
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
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-xl border border-emerald-100 p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">কার্ড নম্বর</span>
            <p className="text-base font-bold text-emerald-700 mt-0.5">{customer?.cardno || cardNo}</p>
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

      <PaidForm postData={postData} isSubmitting={isSubmitting} cardNo={cardNo} />
    </div>
  );
};

export default Paid;
