import { useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import moment from "moment";
import CusInfo from "./CusInfo";
import CusAccountInfo from "./CusAccountInfo";
import Loading from "../../../components/shared/Loading";
import {
  useGetSingleCustomerQuery,
  useGetSingleInstallmentQuery,
} from "../../../redux/feature/api/customerApi";
import { calculateCustomerDues } from "../customerCalculations";

const getBanglaMonth = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const months = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

const CustomerDetails = () => {
  const { cardNo } = useParams();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("ledger"); // "ledger" (TemplateLab) or "details"

  const { data: singleCustomer, isLoading: isCustomerLoading } =
    useGetSingleCustomerQuery(cardNo);
  const { data: singleInstallment } = useGetSingleInstallmentQuery(cardNo, {
    skip: !cardNo,
  });

  const customer = singleCustomer?.data;
  const installments = useMemo(() => {
    return singleInstallment?.data || [];
  }, [singleInstallment]);

  // Live financial metrics
  const dues = useMemo(() => {
    if (!customer) return null;
    return calculateCustomerDues(customer);
  }, [customer]);

  const salePrice = Number(customer?.accountInfo?.saleprice) || 0;
  const hirePrice = Number(customer?.accountInfo?.hireprice) || 0;
  const dpAmount = Number(customer?.accountInfo?.dpamount) || 0;
  const totalPrice = dues?.totalPrice || salePrice + hirePrice;
  const hireDue = Math.max(0, totalPrice - dpAmount);

  const totalPaid = useMemo(() => {
    return installments.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );
  }, [installments]);

  const currentBalance = Math.max(0, hireDue - totalPaid);
  const totalIn = dpAmount + totalPaid;

  const handlePrint = () => {
    window.print();
  };

  // Safely format customer address
  const formattedAddress = useMemo(() => {
    const addr = customer?.customerInfo?.address;
    if (!addr) return customer?.customerInfo?.location || "—";
    if (typeof addr === "string") return addr;
    if (typeof addr === "object") {
      const parts = [
        addr.village,
        addr.union,
        addr.upazila,
        addr.district,
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : customer?.customerInfo?.location || "—";
    }
    return "—";
  }, [customer]);

  // Ledger Table Rows (Down Payment + Installments + Padding Rows)
  const ledgerRows = useMemo(() => {
    const rows = [];

    // 1. Initial Down Payment Row
    if (dpAmount > 0) {
      rows.push({
        id: "dp",
        date: customer?.saledate
          ? moment(customer.saledate).format("DD/MM/YYYY")
          : "—",
        voucher: "ডাউন পেমেন্ট রসিদ",
        description: "প্রাথমিক জমা (ডাউন পেমেন্ট গ্রহণ)",
        inAmount: dpAmount,
        outAmount: hireDue,
      });
    }

    // 2. Installments Rows
    installments.forEach((ins, idx) => {
      const previousInstallmentsSum = installments
        .slice(0, idx + 1)
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      const runningRemainingDue = Math.max(
        0,
        hireDue - previousInstallmentsSum
      );

      const receiverText = ins.receiver ? `${ins.receiver}` : "";
      const commentText = ins.coments ? ` — ${ins.coments}` : "";

      rows.push({
        id: ins._id || idx,
        date: ins.date ? moment(ins.date).format("DD/MM/YYYY") : "—",
        voucher: ins.voucher || "",
        description: `কিস্তি-${idx + 1} জমা গ্রহণ: ${receiverText}${commentText}`,
        inAmount: Number(ins.amount) || 0,
        outAmount: runningRemainingDue,
      });
    });

    return rows;
  }, [dpAmount, customer?.saledate, hireDue, installments]);

  // Ensure minimum 14 rows for the authentic ledger template look
  const totalDisplayRows = Math.max(14, ledgerRows.length + 3);
  const emptyRowsCount = Math.max(0, totalDisplayRows - ledgerRows.length);

  if (isCustomerLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Loading />
        <p className="text-sm font-medium text-gray-500 mt-3">
          গ্রাহকের তথ্য লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-200 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl mb-4">
          <i className="pi pi-exclamation-triangle"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          গ্রাহকের তথ্য পাওয়া যায়নি
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          কার্ড নম্বর{" "}
          <span className="font-mono font-bold text-red-600">#{cardNo}</span> দিয়ে
          কোনো গ্রাহক রেকর্ড পাওয়া যায়নি।
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

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 print:p-0 print:m-0 print:max-w-none">
      {/* Embedded Print Stylesheet for TemplateLab Pixel-Perfect A4 Print */}
      <style>{`
        @media print {
          /* Hide app chrome, headers, sidebars & actions */
          nav, header, .sidebars, .no-print, button, .print-hidden {
            display: none !important;
          }

          /* Reset page margins and background */
          html, body, #wrapper, #content-wrapper, main {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            background: #ffffff !important;
          }

          @page {
            size: A4 portrait;
            margin: 8mm 10mm 10mm 10mm;
          }

          /* Force exact colors and backgrounds */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .template-ledger-container {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* 1. Screen Control & Action Bar (Hidden on Print) */}
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

          {/* View Toggle */}
          <div className="inline-flex p-1 bg-gray-100 rounded-lg border border-gray-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("ledger")}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === "ledger"
                  ? "bg-white text-cyan-800 shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="pi pi-file mr-1 text-[11px]"></i>
              লেজার শিট ভিউ
            </button>
            <button
              type="button"
              onClick={() => setViewMode("details")}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === "details"
                  ? "bg-white text-blue-700 shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="pi pi-id-card mr-1 text-[11px]"></i>
              বিস্তারিত তথ্য ও জামিনদার
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Collect Payment Shortcut */}
          <Link
            to={`/customer/payment/${customer.cardno}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
          >
            <i className="pi pi-money-bill text-sm"></i>
            <span>কিস্তি জমা নিন</span>
          </Link>

          {/* Print Card Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-white bg-[#28b5c9] hover:bg-[#209cad] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <i className="pi pi-print text-sm"></i>
            <span>লেজার প্রিন্ট (A4)</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content View: Either TemplateLab Ledger or Detailed Profile */}
      {viewMode === "ledger" ? (
        /* TemplateLab Business Ledger Sheet (Bangla Version) */
        <div className="template-ledger-container bg-white border border-gray-300 shadow-md rounded-xs p-8 md:p-12 print:border-none print:shadow-none print:p-0 print:max-w-none">
          {/* Top Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            {/* Left: BUSINESS LEDGER Title & Company Details */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-wide text-gray-900">
                ব্যবসায়িক খতিয়ান ও লেজার
              </h1>
              {/* Cyan Accent Bar Under Title */}
              <div className="h-1 bg-[#28b5c9] w-full max-w-sm my-2.5"></div>

              <div className="text-xs text-gray-700 leading-relaxed space-y-0.5">
                <p className="font-extrabold text-sm text-gray-900">
                  {customer.showRoom
                    ? `রুবেল অটোমোবাইলস — ${customer.showRoom} শোরুম`
                    : "রুবেল অটোমোবাইলস"}
                </p>
                <p className="text-gray-600">
                  {customer.showRoom || "প্রধান কার্যালয়"}, কুমিল্লা, বাংলাদেশ
                </p>
                <p className="text-gray-600 font-mono">
                  মোবাইল: {customer.customerInfo?.number || "০১৭১১-XXXXXX"}
                </p>
                <p className="text-gray-600">
                  ওয়েবসাইট: www.rubelautomobiles.com
                </p>
              </div>
            </div>

            {/* Right: Date Month & Starting Balance Card */}
            <div className="flex flex-col items-start sm:items-end shrink-0 w-full sm:w-auto">
              <h2 className="text-2xl font-black text-[#28b5c9] tracking-wider mb-2">
                {getBanglaMonth(customer.saledate || new Date())}
              </h2>

              <div className="border border-[#bde7ef] bg-[#f4fbfc] px-6 py-2.5 text-center w-full sm:w-60">
                <p className="text-2xl font-extrabold text-gray-900">
                  ৳ {totalPrice.toLocaleString()}
                </p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  প্রারম্ভিক বকেয়া (Starting Balance)
                </p>
              </div>
            </div>
          </div>

          {/* Two-Column Metadata Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2.5 my-7 text-xs md:text-sm">
            {/* Left Column */}
            <div className="space-y-2">
              <div className="flex items-baseline">
                <span className="font-bold text-gray-900 w-36 shrink-0">
                  গ্রাহকের নাম:
                </span>
                <span className="text-gray-800 font-semibold">
                  {customer.customerInfo?.name || "—"}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-gray-900 w-36 shrink-0">
                  শোরুম / শাখা:
                </span>
                <span className="text-gray-800">
                  {customer.showRoom || "রুবেল অটো"}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-gray-900 w-36 shrink-0">
                  গাড়ির মডেল:
                </span>
                <span className="text-gray-800 font-medium">
                  {customer.productInfo?.models || "—"}{" "}
                  {customer.productCond && `(${customer.productCond})`}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-gray-900 w-36 shrink-0">
                  স্থায়ী ঠিকানা:
                </span>
                <span className="text-gray-800">
                  {formattedAddress}
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <div className="flex items-baseline">
                <span className="font-bold text-gray-900 w-36 shrink-0">
                  পিতা / স্বামীর নাম:
                </span>
                <span className="text-gray-800">
                  {customer.customerInfo?.coname || "—"}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-gray-900 w-36 shrink-0">
                  কার্ড নম্বর:
                </span>
                <span className="font-mono font-bold text-gray-900">
                  #{customer.cardno}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-gray-900 w-36 shrink-0">
                  ইঞ্জিন ও চ্যাসিস:
                </span>
                <span className="font-mono text-gray-700 text-xs">
                  {customer.productInfo?.engine || "—"} /{" "}
                  {customer.productInfo?.chassis || "—"}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-gray-900 w-36 shrink-0">
                  মোবাইল নম্বর:
                </span>
                <span className="font-mono text-gray-800">
                  {customer.customerInfo?.number || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* The Ledger Table */}
          <div className="border border-gray-300 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-[#28b5c9] text-white font-bold text-xs tracking-wider">
                  <th className="py-2.5 px-3 border-r border-[#3ac2d5] w-[16%] text-center">
                    তারিখ
                  </th>
                  <th className="py-2.5 px-3 border-r border-[#3ac2d5] w-[54%]">
                    বিস্তারিত বিবরণ ও আদায়কারী
                  </th>
                  <th className="py-2.5 px-3 border-r border-[#3ac2d5] text-right w-[15%]">
                    জমা (In)
                  </th>
                  <th className="py-2.5 px-3 text-right w-[15%]">
                    বকেয়া (Out)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* 1. Transaction Rows */}
                {ledgerRows.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-2 px-3 border-r border-gray-200 text-gray-700 whitespace-nowrap text-center font-mono">
                      {row.date}
                    </td>
                    <td className="py-2 px-3 border-r border-gray-200 text-gray-800">
                      <div className="font-medium text-gray-900">{row.description} {" "} 
                      {row.voucher && (
                        <>
                        ভাউচার নং: <span className="font-semibold text-blue-700">{row.voucher}</span>
                         {/* <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                         ভাউচার নং: <span className="font-semibold text-blue-700">{row.voucher}</span>
                         </div> */}
                        </>
                        
                      )}</div>
                    </td>
                    <td className="py-2 px-3 border-r border-gray-200 text-right font-semibold text-gray-900 bg-[#eef8fa] whitespace-nowrap">
                      ৳ {row.inAmount.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-gray-800 bg-[#eef8fa] whitespace-nowrap">
                      {row.outAmount !== undefined
                        ? `৳ ${row.outAmount.toLocaleString()}`
                        : ""}
                    </td>
                  </tr>
                ))}

                {/* 2. Empty Rows to complete the template look */}
                {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="h-8">
                    <td className="py-2 px-3 border-r border-gray-200">&nbsp;</td>
                    <td className="py-2 px-3 border-r border-gray-200">&nbsp;</td>
                    <td className="py-2 px-3 border-r border-gray-200 bg-[#eef8fa]">&nbsp;</td>
                    <td className="py-2 px-3 bg-[#eef8fa]">&nbsp;</td>
                  </tr>
                ))}
              </tbody>

              {/* Black Total Bar */}
              <tfoot>
                <tr className="bg-black text-white font-bold text-xs md:text-sm">
                  <td colSpan={2} className="py-2.5 px-4 tracking-wider">
                    সর্বমোট হিসাব (TOTAL):
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap text-emerald-400">
                    ৳ {totalIn.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    ৳ {currentBalance.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Below Table: Questions, Signatures & Current Balance */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mt-6 pt-2">
            {/* Left: QUESTIONS & Signatures */}
            <div className="space-y-4 flex-1 w-full sm:w-auto">
              <div>
                <p className="font-extrabold text-xs text-gray-900">
                  কোনো জিজ্ঞাসা বা তথ্য?
                </p>
                <p className="text-xs text-gray-600">
                  যোগাযোগ: রুবেল অটোমোবাইলস — মোবাইল: (৮৮০) {customer.customerInfo?.number || "০১৭১১-XXXXXX"}
                </p>
              </div>

              {/* Official Signatures Lines */}
              <div className="grid grid-cols-2 gap-8 pt-4 text-xs text-gray-700">
                <div>
                  <div className="border-t border-gray-400 pt-1 text-center">
                    <span className="font-bold text-gray-800">
                      গ্রাহকের স্বাক্ষর
                    </span>
                    <p className="text-[10px] text-gray-500">Customer Signature</p>
                  </div>
                </div>
                <div>
                  <div className="border-t border-gray-400 pt-1 text-center">
                    <span className="font-bold text-gray-800">
                      কর্তৃপক্ষ / ম্যানেজারের স্বাক্ষর
                    </span>
                    <p className="text-[10px] text-gray-500">Authorized Signature</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Current Balance Block */}
            <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-end">
              <span className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap">
                বর্তমান বকেয়া:
              </span>
              <div className="bg-[#28b5c9] text-white px-8 py-3 text-2xl md:text-3xl font-black min-w-[210px] text-center shadow-xs">
                ৳ {currentBalance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Bottom Credit Line */}
          <div className="text-right text-[10px] text-gray-400 mt-6 pt-2 border-t border-gray-100">
            © রুবেল অটোমোবাইলস ইআরপি সিস্টেম | সর্বস্বত্ব সংরক্ষিত
          </div>
        </div>
      ) : (
        /* Detailed Profile & Guarantor View */
        <div className="space-y-6">
          <CusInfo singleCustomer={customer} dues={dues} />
          <CusAccountInfo singleCustomer={customer} dues={dues} />
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
