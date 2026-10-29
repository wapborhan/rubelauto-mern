import { useMemo } from "react";
import moment from "moment";

const CusInfo = ({ singleCustomer, dues }) => {
  if (!singleCustomer) return null;

  const {
    cardno,
    saledate,
    accountInfo,
    customerInfo,
    productInfo,
    showRoom,
    productCond,
  } = singleCustomer;

  // Safely format address
  const formattedAddress = useMemo(() => {
    const addr = customerInfo?.address;
    if (!addr) return customerInfo?.location || "—";
    if (typeof addr === "string") return addr;
    if (typeof addr === "object") {
      const parts = [
        addr.village,
        addr.union,
        addr.upazila,
        addr.district,
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : customerInfo?.location || "—";
    }
    return "—";
  }, [customerInfo]);

  // Safely extract guarantors
  const guarantors = useMemo(() => {
    const g = customerInfo?.guarantor;
    if (!g) return [];
    if (Array.isArray(g)) return g.filter(Boolean);
    if (typeof g === "object") {
      return [g.guarantor1, g.guarantor2].filter(Boolean);
    }
    return [];
  }, [customerInfo]);

  const salePrice = Number(accountInfo?.saleprice) || 0;
  const hirePrice = Number(accountInfo?.hireprice) || 0;
  const dpAmount = Number(accountInfo?.dpamount) || 0;
  const totalPrice = dues?.totalPrice || salePrice + hirePrice;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 print:grid-cols-3 print:gap-3">
      {/* 1. গ্রাহক ও জামিনদার তথ্য */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col print:border print:border-gray-300 print:shadow-none print-break-inside-avoid">
        <div className="px-4 py-3 bg-blue-50/60 border-b border-gray-200 flex items-center justify-between print:bg-gray-100 print:py-1.5 print:px-2.5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs print:hidden">
              <i className="pi pi-user"></i>
            </span>
            <h4 className="font-bold text-gray-800 text-sm print:text-xs">
              গ্রাহক ও জামিনদার পরিচিতি
            </h4>
          </div>
          <span className="font-mono text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 print:border-gray-400 print:text-black">
            #{cardno}
          </span>
        </div>

        <div className="p-4 space-y-2.5 text-xs md:text-sm flex-1 print:p-2 print:space-y-1.5 print:text-[11px]">
          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">গ্রাহকের নাম:</span>
            <span className="font-bold text-gray-900 text-right">
              {customerInfo?.name || "—"}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">পিতা / স্বামীর নাম:</span>
            <span className="text-gray-800 font-medium text-right">
              {customerInfo?.coname || "—"}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">মোবাইল নম্বর:</span>
            <span className="font-mono font-bold text-blue-600 text-right">
              {customerInfo?.number ? (
                <a
                  href={`tel:${customerInfo.number}`}
                  className="hover:underline text-blue-700 print:text-black print:no-underline"
                >
                  {customerInfo.number}
                </a>
              ) : (
                "—"
              )}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">জাতীয় পরিচয়পত্র:</span>
            <span className="font-mono text-gray-800 text-right">
              {customerInfo?.nid || "—"}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">স্থায়ী ঠিকানা:</span>
            <span className="text-gray-800 text-right max-w-[60%] leading-relaxed">
              {formattedAddress}
            </span>
          </div>

          {customerInfo?.location && (
            <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
              <span className="text-gray-500 font-medium">এলাকা / রুট:</span>
              <span className="text-gray-800 text-right">
                {customerInfo.location}
              </span>
            </div>
          )}

          {customerInfo?.media && (
            <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
              <span className="text-gray-500 font-medium">মিডিয়া / রেফারেন্স:</span>
              <span className="text-gray-800 text-right">
                {customerInfo.media}
              </span>
            </div>
          )}

          {/* Guarantor Details */}
          {guarantors.length > 0 && (
            <div className="pt-2 border-t border-dashed border-gray-200 mt-2 print:pt-1">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 print:text-[10px]">
                জামিনদার তথ্য:
              </p>
              {guarantors.map((gd, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-2 rounded-lg border border-gray-100 mb-1.5 text-xs print:bg-white print:border-gray-200 print:p-1 print:text-[10px]"
                >
                  <div className="flex justify-between font-semibold text-gray-800">
                    <span>{gd.name || `জামিনদার ${idx + 1}`}</span>
                    {gd.mobile && (
                      <span className="font-mono text-gray-600">
                        {gd.mobile}
                      </span>
                    )}
                  </div>
                  {gd.address && (
                    <p className="text-[11px] text-gray-500 mt-0.5 print:text-[9px]">
                      {gd.address}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. মোটরসাইকেল ও পণ্য তথ্য */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col print:border print:border-gray-300 print:shadow-none print-break-inside-avoid">
        <div className="px-4 py-3 bg-emerald-50/60 border-b border-gray-200 flex items-center justify-between print:bg-gray-100 print:py-1.5 print:px-2.5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs print:hidden">
              <i className="pi pi-car"></i>
            </span>
            <h4 className="font-bold text-gray-800 text-sm print:text-xs">
              গাড়ি ও পণ্যের বিবরণী
            </h4>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 print:border-gray-400 print:text-black">
            {productCond || "New"}
          </span>
        </div>

        <div className="p-4 space-y-2.5 text-xs md:text-sm flex-1 print:p-2 print:space-y-1.5 print:text-[11px]">
          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">পণ্যের ধরন:</span>
            <span className="font-bold text-gray-900 text-right">
              {productInfo?.type || "মোটরসাইকেল"}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">মডেল (Model):</span>
            <span className="font-extrabold text-blue-900 text-right">
              {productInfo?.models || "—"}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">ইঞ্জিন নম্বর:</span>
            <span className="font-mono font-bold text-gray-900 bg-gray-50 px-1.5 py-0.5 rounded text-right print:bg-transparent print:p-0">
              {productInfo?.engine || "—"}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">চ্যাসিস নম্বর:</span>
            <span className="font-mono font-bold text-gray-900 bg-gray-50 px-1.5 py-0.5 rounded text-right print:bg-transparent print:p-0">
              {productInfo?.chassis || "—"}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">রঙ (Color):</span>
            <span className="text-gray-800 font-medium text-right">
              {productInfo?.color || "—"}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">বিক্রয়কারী শোরুম:</span>
            <span className="font-semibold text-gray-800 text-right">
              {showRoom || "—"}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">বিক্রয়ের তারিখ:</span>
            <span className="font-medium text-gray-800 text-right">
              {saledate ? moment(saledate).format("DD-MMM-YYYY") : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. চুক্তি ও কিস্তির আর্থিক বিবরণী */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col print:border print:border-gray-300 print:shadow-none print-break-inside-avoid">
        <div className="px-4 py-3 bg-indigo-50/60 border-b border-gray-200 flex items-center justify-between print:bg-gray-100 print:py-1.5 print:px-2.5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs print:hidden">
              <i className="pi pi-wallet"></i>
            </span>
            <h4 className="font-bold text-gray-800 text-sm print:text-xs">
              চুক্তি ও আর্থিক বিবরণী
            </h4>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 print:border-gray-400 print:text-black">
            {accountInfo?.term ? `${accountInfo.term} মাস` : "নগদ"}
          </span>
        </div>

        <div className="p-4 space-y-2.5 text-xs md:text-sm flex-1 print:p-2 print:space-y-1.5 print:text-[11px]">
          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">নগদ বিক্রয় মূল্য:</span>
            <span className="font-semibold text-gray-800 text-right">
              ৳ {salePrice.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">ডাউন পেমেন্ট:</span>
            <span className="font-bold text-emerald-600 text-right">
              ৳ {dpAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">হায়ার চার্জ / সুদ:</span>
            <span className="font-semibold text-gray-700 text-right">
              ৳ {hirePrice.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-200 bg-indigo-50/40 p-1.5 rounded print:bg-gray-100 print:pb-1">
            <span className="text-indigo-950 font-bold print:text-black">
              সর্বমোট চুক্তি মূল্য:
            </span>
            <span className="font-extrabold text-indigo-700 text-right print:text-black">
              ৳ {totalPrice.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">কিস্তির মেয়াদ:</span>
            <span className="font-semibold text-gray-800 text-right">
              {accountInfo?.term ? `${accountInfo.term} মাস` : "—"}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">মাসিক কিস্তির পরিমাণ:</span>
            <span className="font-bold text-blue-700 text-right">
              ৳ {(Number(accountInfo?.insamount) || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
            <span className="text-gray-500 font-medium">প্রতি মাসের কিস্তির তারিখ:</span>
            <span className="font-medium text-gray-800 text-right">
              {accountInfo?.insdate
                ? `${moment(accountInfo.insdate).format("D")} তারিখ`
                : "—"}
            </span>
          </div>

          {accountInfo?.agrefee ? (
            <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
              <span className="text-gray-500 font-medium">এগ্রিমেন্ট ফি:</span>
              <span className="text-gray-800 text-right">
                ৳ {Number(accountInfo.agrefee).toLocaleString()}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CusInfo;
