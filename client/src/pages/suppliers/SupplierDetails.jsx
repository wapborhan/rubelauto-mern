import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetSingleSupplierQuery } from "../../redux/feature/api/supplierApi";
import Loading from "../../components/shared/Loading";
import SupplierDetailPur from "./SupplierDetailPur";

const SuplierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const {
    data: singleSuplier,
    isLoading,
    isError,
  } = useGetSingleSupplierQuery(id);

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Loading />
        <p className="text-sm font-medium text-gray-500 mt-3">
          সাপ্লায়ার তথ্য লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (isError || !singleSuplier?.data) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-200 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl mb-4">
          <i className="pi pi-exclamation-triangle"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          সাপ্লায়ার তথ্য পাওয়া যায়নি
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          সাপ্লায়ার আইডি দিয়ে কোনো তথ্য লোড করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors cursor-pointer"
          >
            <i className="pi pi-arrow-left text-xs"></i>
            পেছনে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  const {
    bssName,
    bssLogoUrl,
    empName,
    email,
    mobile,
    address,
    openingBalance,
    currentBalance,
    totalPurchase,
    totalPayment,
    prodType,
  } = singleSuplier?.data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6 print:p-0 print:space-y-4">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors cursor-pointer"
            title="পূর্ববর্তী পেজে ফিরে যান"
          >
            <i className="pi pi-arrow-left text-xs"></i>
            <span>পেছনে যান</span>
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Link to="/contact/supplier/view" className="hover:text-blue-600 font-medium">
                সাপ্লায়ার তালিকা
              </Link>
              <span>/</span>
              <span className="font-bold text-gray-800">
                {bssName || "বিস্তারিত"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Make Payment Button */}
          <Link
            to={`/contact/supplier/payment/${id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
          >
            <i className="pi pi-credit-card text-xs"></i>
            <span>পেমেন্ট প্রদান</span>
          </Link>

          {/* Edit Supplier Button */}
          <Link
            to={`/contact/supplier/edit/${id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 shadow-2xs transition-colors"
          >
            <i className="pi pi-file-edit text-blue-600"></i>
            <span>সম্পাদনা</span>
          </Link>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <i className="pi pi-print text-xs"></i>
            <span>প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* Supplier Info Section (Exact Fieldset Layout Polished) */}
      <fieldset className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 md:p-7 print:border-gray-300">
        <legend className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 text-xs md:text-sm">
          সাপ্লায়ার তথ্য
        </legend>

        <div className="supplier my-2 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* 1. Left: Image / Logo */}
          <div className="md:col-span-3 lg:col-span-2 flex items-center justify-center">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden p-2 shadow-2xs">
              {bssLogoUrl && !imageError ? (
                <img
                  src={bssLogoUrl}
                  alt={bssName || "Supplier Logo"}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <i className="pi pi-building text-3xl mb-1 block"></i>
                  <span className="text-[10px] font-medium block">লোগো নেই</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Middle: Supplier Details */}
          <div className="infos md:col-span-5 lg:col-span-6 space-y-2 text-xs md:text-sm">
            <div className="flex items-start justify-start gap-2 w-full pb-1.5 border-b border-gray-100">
              <span className="font-bold text-gray-700 w-28 shrink-0">সাপ্লায়ার:</span>
              <span className="font-extrabold text-gray-900 text-sm md:text-base">
                {bssName || "—"}
              </span>
              {prodType && (
                <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 ml-1">
                  {prodType}
                </span>
              )}
            </div>

            <div className="flex items-start justify-start gap-2 w-full pb-1.5 border-b border-gray-100">
              <span className="font-bold text-gray-700 w-28 shrink-0">ঠিকানা:</span>
              <span className="text-gray-800 leading-relaxed">
                {address || "—"}
              </span>
            </div>

            <div className="flex items-center justify-start gap-2 w-full pb-1.5 border-b border-gray-100">
              <span className="font-bold text-gray-700 w-28 shrink-0">কর্মচারীর নাম:</span>
              <span className="text-gray-900 font-medium">
                {empName || "—"}
              </span>
            </div>

            <div className="flex items-center justify-start gap-2 w-full pb-1.5 border-b border-gray-100">
              <span className="font-bold text-gray-700 w-28 shrink-0">মোবাইল:</span>
              <span className="font-mono font-bold text-blue-700">
                {mobile ? (
                  <a href={`tel:${mobile}`} className="hover:underline">
                    {mobile}
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>

            <div className="flex items-center justify-start gap-2 w-full">
              <span className="font-bold text-gray-700 w-28 shrink-0">Email:</span>
              <span className="text-gray-700 font-mono text-xs">
                {email ? (
                  <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                    {email}
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>
          </div>

          {/* 3. Right: Financial Balances */}
          <div className="infos md:col-span-4 lg:col-span-4 space-y-2 bg-gray-50/90 p-4 rounded-xl border border-gray-200 text-xs md:text-sm">
            <div className="flex items-center justify-between gap-2 w-full pb-1.5 border-b border-gray-200">
              <span className="font-bold text-gray-600">ওপেনিং ব্যালেন্স:</span>
              <span className="font-semibold text-gray-800">
                ৳ {Number(openingBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 w-full pb-1.5 border-b border-gray-200">
              <span className="font-bold text-gray-600">মোট ক্রয়:</span>
              <span className="font-bold text-gray-900">
                ৳ {Number(totalPurchase || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 w-full pb-1.5 border-b border-gray-200">
              <span className="font-bold text-gray-600">মোট পেমেন্ট:</span>
              <span className="font-bold text-emerald-600">
                ৳ {Number(totalPayment || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 w-full pt-1">
              <span className="font-black text-gray-800 text-sm">বর্তমান বাকি:</span>
              <span className="font-black text-red-600 text-base md:text-lg">
                ৳ {Number(currentBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Statement Section Component */}
      <SupplierDetailPur supplierId={id} />
    </div>
  );
};

export default SuplierDetails;
