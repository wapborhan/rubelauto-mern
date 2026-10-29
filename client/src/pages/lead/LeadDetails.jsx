import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import moment from "moment";
import { useGetSingleLeadQuery } from "../../redux/feature/api/leadApi";
import Loading from "../../components/shared/Loading";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: singleLead, isLoading } = useGetSingleLeadQuery(id);

  const lead = singleLead?.data;

  // Safely extract guarantors
  const guarantor1 = useMemo(() => {
    return lead?.guarantor?.[0]?.guarantor1 || lead?.guarantor?.[0] || null;
  }, [lead]);

  const guarantor2 = useMemo(() => {
    return lead?.guarantor?.[0]?.guarantor2 || lead?.guarantor?.[1] || null;
  }, [lead]);

  const hasGuarantor1 = Boolean(guarantor1 && (guarantor1.name || guarantor1.mobile));
  const hasGuarantor2 = Boolean(guarantor2 && (guarantor2.name || guarantor2.mobile));
  const hasGuarantors = hasGuarantor1 || hasGuarantor2;

  // Render Address safely
  const renderAddress = (address) => {
    if (!address) return "—";
    if (typeof address === "object") {
      const { village, union, upazila, district, division } = address;
      const parts = [village, union, upazila, district, division].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "—";
    }
    return address || "—";
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "hot":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          label: "হট লিড (Hot)",
          icon: "pi-bolt",
        };
      case "warm":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          label: "ওয়ার্ম লিড (Warm)",
          icon: "pi-sun",
        };
      case "cold":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          label: "কোল্ড লিড (Cold)",
          icon: "pi-snowflake",
        };
      default:
        return {
          bg: "bg-gray-50 text-gray-700 border-gray-200",
          label: status || "সাধারণ লিড",
          icon: "pi-tag",
        };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Loading />
        <p className="text-sm font-medium text-gray-500 mt-3">
          লিডের তথ্য লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-200 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl mb-4">
          <i className="pi pi-exclamation-triangle"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          লিডের তথ্য পাওয়া যায়নি
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          আইডি <span className="font-mono font-bold text-red-600">#{id}</span> দিয়ে কোনো লিড রেকর্ড পাওয়া যায়নি।
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

  const badgeInfo = getStatusBadge(lead.status);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6 print:p-0 print:space-y-3 print:max-w-none">
      {/* Embedded Print Stylesheet */}
      <style>{`
        @media print {
          nav, header, .sidebars, .no-print, button, .print-hidden {
            display: none !important;
          }

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
            margin: 10mm;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .print-header {
            display: block !important;
          }

          .print-signatures {
            display: grid !important;
          }
        }
      `}</style>

      {/* 1. Official Letterhead Header for Print Only */}
      <div className="hidden print-header text-center border-b-2 border-gray-800 pb-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              রুবেল অটোমোবাইলস
            </h1>
            <p className="text-xs text-gray-600">
              গ্রাহক লিড ও জামিনদার যাচাইকরণ ফরম
            </p>
          </div>
          <div className="text-right text-[10px] text-gray-500">
            <p>প্রিন্ট তারিখ: {moment().format("DD-MMM-YYYY, hh:mm A")}</p>
            <p className="font-mono">লিড আইডি: #{id}</p>
          </div>
        </div>
      </div>

      {/* 2. Screen Action Bar & Breadcrumbs (Hidden on Print) */}
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
              <Link to="/contact/lead/view" className="hover:text-blue-600 font-medium">
                লিড ব্যবস্থাপনা
              </Link>
              <span>/</span>
              <span className="font-bold text-gray-800">
                লিড বিস্তারিত (#{id?.slice(-6)})
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Edit Lead Button */}
          <Link
            to={`/contact/lead/edit/${id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 shadow-2xs transition-colors"
          >
            <i className="pi pi-user-edit text-blue-600"></i>
            <span>লিড সম্পাদনা</span>
          </Link>

          {/* Guarantor Edit / Add Button */}
          <Link
            to={
              hasGuarantors
                ? `/contact/lead/edit/guarantor/${id}`
                : `/contact/lead/add/guarantor/${id}`
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 shadow-2xs transition-colors"
          >
            <i className="pi pi-users text-indigo-600"></i>
            <span>{hasGuarantors ? "জামিনদার সম্পাদনা" : "+ জামিনদার যোগ"}</span>
          </Link>

          {/* Convert to Sale Button */}
          <Link
            to="/sale/credit"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
          >
            <i className="pi pi-shopping-cart text-xs"></i>
            <span>বিক্রয়ে রূপান্তর</span>
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

      {/* 3. Lead Profile Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden print:border print:border-gray-300 print:shadow-none print-break-inside-avoid">
        <div className="p-5 md:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:bg-white print:text-black print:p-3 print:border-b print:border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center text-2xl font-black border border-white/20 shrink-0 print:hidden">
              {lead.name?.charAt(0) || "L"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeInfo.bg}`}
                >
                  <i className={`pi ${badgeInfo.icon} text-[10px]`}></i>
                  {badgeInfo.label}
                </span>

                {lead.location && (
                  <span className="text-xs bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 print:border-gray-400 print:text-black print:bg-transparent">
                    <i className="pi pi-map-marker mr-1 text-[10px]"></i>
                    {lead.location}
                  </span>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-black tracking-tight print:text-lg">
                {lead.name}
              </h2>
              {lead.coname && (
                <p className="text-xs text-slate-300 mt-0.5 print:text-gray-600">
                  পিতা / স্বামী: {lead.coname}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs print:text-[11px]">
            {lead.number && (
              <a
                href={`tel:${lead.number}`}
                className="bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-2 transition-colors print:bg-transparent print:border-gray-300 print:text-black"
              >
                <i className="pi pi-phone text-emerald-400 print:hidden"></i>
                <span className="font-mono font-bold text-white print:text-black">
                  {lead.number}
                </span>
              </a>
            )}

            {lead.nid && (
              <div className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl print:bg-transparent print:border-gray-300 print:text-black">
                এনআইডি:{" "}
                <strong className="text-white font-mono print:text-black">
                  {lead.nid}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/60 border-b border-gray-200 text-xs print:p-2 print:bg-white">
          <div>
            <span className="text-gray-500 block">মিডিয়া / রেফারেন্স:</span>
            <span className="font-semibold text-gray-900">{lead.media || "সরাসরি ভিজিট"}</span>
          </div>
          <div>
            <span className="text-gray-500 block">এলাকা / রুট:</span>
            <span className="font-semibold text-gray-900">{lead.location || "—"}</span>
          </div>
          <div>
            <span className="text-gray-500 block">জামিনদার স্ট্যাটাস:</span>
            <span className={`font-bold ${hasGuarantors ? "text-emerald-600" : "text-amber-600"}`}>
              {hasGuarantors ? "২ জন সংযুক্ত রয়েছে" : "কোনো জামিনদার নেই"}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">বর্তমান স্ট্যাটাস:</span>
            <span className="font-semibold text-gray-900">{lead.status || "Warm"}</span>
          </div>
        </div>
      </div>

      {/* 4. Core Details: Customer Info & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:grid-cols-2 print:gap-3">
        {/* Personal & Contact Profile */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden print:border print:border-gray-300 print:shadow-none print-break-inside-avoid">
          <div className="px-4 py-3 bg-blue-50/60 border-b border-gray-200 flex items-center justify-between print:bg-gray-100 print:py-1.5 print:px-2.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs print:hidden">
                <i className="pi pi-user"></i>
              </span>
              <h4 className="font-bold text-gray-800 text-sm print:text-xs">
                গ্রাহকের ব্যক্তিগত ও যোগাযোগের তথ্য
              </h4>
            </div>
            <Link
              to={`/contact/lead/edit/${id}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 print:hidden"
            >
              <span>সম্পাদনা</span>
              <i className="pi pi-pencil text-[10px]"></i>
            </Link>
          </div>

          <div className="p-4 space-y-2.5 text-xs md:text-sm print:p-2.5 print:space-y-1.5 print:text-[11px]">
            <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
              <span className="text-gray-500 font-medium">গ্রাহকের নাম:</span>
              <span className="font-bold text-gray-900 text-right">{lead.name || "—"}</span>
            </div>

            <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
              <span className="text-gray-500 font-medium">পিতা / স্বামীর নাম:</span>
              <span className="text-gray-800 font-medium text-right">{lead.coname || "—"}</span>
            </div>

            <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
              <span className="text-gray-500 font-medium">মোবাইল নম্বর:</span>
              <span className="font-mono font-bold text-blue-700 text-right">
                {lead.number ? (
                  <a href={`tel:${lead.number}`} className="hover:underline">
                    {lead.number}
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>

            <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
              <span className="text-gray-500 font-medium">জাতীয় পরিচয়পত্র (NID):</span>
              <span className="font-mono text-gray-900 text-right">{lead.nid || "—"}</span>
            </div>

            <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
              <span className="text-gray-500 font-medium">এলাকা / রুট:</span>
              <span className="text-gray-800 text-right">{lead.location || "—"}</span>
            </div>

            <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
              <span className="text-gray-500 font-medium">মিডিয়া / রেফারেন্স:</span>
              <span className="text-gray-800 text-right">{lead.media || "—"}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-500 font-medium">লিড স্ট্যাটাস:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${badgeInfo.bg}`}>
                {badgeInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden print:border print:border-gray-300 print:shadow-none print-break-inside-avoid">
          <div className="px-4 py-3 bg-emerald-50/60 border-b border-gray-200 flex items-center justify-between print:bg-gray-100 print:py-1.5 print:px-2.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs print:hidden">
                <i className="pi pi-map"></i>
              </span>
              <h4 className="font-bold text-gray-800 text-sm print:text-xs">
                ঠিকানা ও ভৌগোলিক বিবরণী
              </h4>
            </div>
          </div>

          <div className="p-4 space-y-2.5 text-xs md:text-sm print:p-2.5 print:space-y-1.5 print:text-[11px]">
            {typeof lead.address === "object" && lead.address ? (
              <>
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">গ্রাম / রাস্তা:</span>
                  <span className="text-gray-800 text-right">{lead.address.village || "—"}</span>
                </div>
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">ইউনিয়ন / ওয়ার্ড:</span>
                  <span className="text-gray-800 text-right">{lead.address.union || "—"}</span>
                </div>
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">উপজেলা / থানা:</span>
                  <span className="text-gray-800 text-right">{lead.address.upazila || "—"}</span>
                </div>
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">জেলা:</span>
                  <span className="text-gray-800 font-semibold text-right">
                    {lead.address.district || "—"}
                  </span>
                </div>
                {lead.address.division && (
                  <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                    <span className="text-gray-500 font-medium">বিভাগ:</span>
                    <span className="text-gray-800 text-right">{lead.address.division}</span>
                  </div>
                )}
              </>
            ) : null}

            <div className="pt-1">
              <span className="text-gray-500 font-medium block mb-1">পূর্ণাঙ্গ ঠিকানা:</span>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-gray-800 font-medium leading-relaxed print:bg-white print:border-gray-200">
                {renderAddress(lead.address)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Guarantors Information Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <h3 className="font-bold text-gray-800 text-base md:text-lg">
              জামিনদারদের বিবরণী (Guarantors Information)
            </h3>
          </div>

          <Link
            to={
              hasGuarantors
                ? `/contact/lead/edit/guarantor/${id}`
                : `/contact/lead/add/guarantor/${id}`
            }
            className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
          >
            <i className={`pi ${hasGuarantors ? "pi-pencil" : "pi-plus"} text-xs`}></i>
            <span>{hasGuarantors ? "জামিনদার তথ্য সম্পাদনা" : "+ জামিনদার যোগ করুন"}</span>
          </Link>
        </div>

        {hasGuarantors ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:grid-cols-2 print:gap-3">
            {/* Guarantor 1 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden print:border print:border-gray-300 print:shadow-none print-break-inside-avoid">
              <div className="px-4 py-3 bg-indigo-50/60 border-b border-gray-200 flex items-center justify-between print:bg-gray-100 print:py-1.5 print:px-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold print:hidden">
                    ১
                  </span>
                  <h4 className="font-bold text-gray-800 text-sm print:text-xs">
                    ১ম জামিনদার (Guarantor 1)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 print:border-gray-400 print:text-black">
                  {guarantor1?.name ? "সংযুক্ত" : "অসম্পূর্ণ"}
                </span>
              </div>

              <div className="p-4 space-y-2.5 text-xs md:text-sm print:p-2.5 print:space-y-1.5 print:text-[11px]">
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">নাম:</span>
                  <span className="font-bold text-gray-900 text-right">
                    {guarantor1?.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">পিতা / স্বামীর নাম:</span>
                  <span className="text-gray-800 text-right">
                    {guarantor1?.coname || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">মোবাইল নম্বর:</span>
                  <span className="font-mono font-bold text-blue-700 text-right">
                    {guarantor1?.mobile ? (
                      <a href={`tel:${guarantor1.mobile}`} className="hover:underline">
                        {guarantor1.mobile}
                      </a>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">জাতীয় পরিচয়পত্র:</span>
                  <span className="font-mono text-gray-800 text-right">
                    {guarantor1?.nid || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 font-medium">ঠিকানা:</span>
                  <span className="text-gray-800 text-right max-w-[65%] leading-relaxed">
                    {renderAddress(guarantor1?.address)}
                  </span>
                </div>
              </div>
            </div>

            {/* Guarantor 2 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden print:border print:border-gray-300 print:shadow-none print-break-inside-avoid">
              <div className="px-4 py-3 bg-purple-50/60 border-b border-gray-200 flex items-center justify-between print:bg-gray-100 print:py-1.5 print:px-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold print:hidden">
                    ২
                  </span>
                  <h4 className="font-bold text-gray-800 text-sm print:text-xs">
                    ২য় জামিনদার (Guarantor 2)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200 print:border-gray-400 print:text-black">
                  {guarantor2?.name ? "সংযুক্ত" : "অসম্পূর্ণ"}
                </span>
              </div>

              <div className="p-4 space-y-2.5 text-xs md:text-sm print:p-2.5 print:space-y-1.5 print:text-[11px]">
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">নাম:</span>
                  <span className="font-bold text-gray-900 text-right">
                    {guarantor2?.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">পিতা / স্বামীর নাম:</span>
                  <span className="text-gray-800 text-right">
                    {guarantor2?.coname || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">মোবাইল নম্বর:</span>
                  <span className="font-mono font-bold text-blue-700 text-right">
                    {guarantor2?.mobile ? (
                      <a href={`tel:${guarantor2.mobile}`} className="hover:underline">
                        {guarantor2.mobile}
                      </a>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-start pb-2 border-b border-gray-100 print:pb-1">
                  <span className="text-gray-500 font-medium">জাতীয় পরিচয়পত্র:</span>
                  <span className="font-mono text-gray-800 text-right">
                    {guarantor2?.nid || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 font-medium">ঠিকানা:</span>
                  <span className="text-gray-800 text-right max-w-[65%] leading-relaxed">
                    {renderAddress(guarantor2?.address)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl mb-3">
              <i className="pi pi-users"></i>
            </div>
            <h4 className="font-bold text-gray-800 text-sm">
              এই লিডের কোনো জামিনদার যুক্ত করা নেই
            </h4>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              কিস্তিতে বিক্রয় করার আগে গ্রাহকের ১ম ও ২য় জামিনদারের নাম, মোবাইল ও এনআইডি তথ্য যোগ করুন
            </p>
            <div className="mt-4">
              <Link
                to={`/contact/lead/add/guarantor/${id}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                <i className="pi pi-plus text-xs"></i>
                জামিনদার যোগ করুন
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 6. Convert to Sale Quick Banner (Hidden on Print) */}
      <div className="no-print bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/10 text-emerald-300 flex items-center justify-center text-xl shrink-0 border border-white/20">
            <i className="pi pi-shopping-bag"></i>
          </div>
          <div>
            <h4 className="font-bold text-sm md:text-base">
              লিড থেকে সরাসরি বিক্রয় চালান তৈরি করুন
            </h4>
            <p className="text-xs text-emerald-200 mt-0.5">
              এই গ্রাহকের তথ্য দিয়ে নগদ বা কিস্তিতে বিক্রয় সম্পন্ন করতে নিচের বোতামে চাপ দিন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Link
            to="/sale/credit"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-white text-emerald-900 hover:bg-emerald-50 rounded-lg shadow transition-colors"
          >
            <i className="pi pi-percentage text-xs"></i>
            কিস্তিতে বিক্রয়
          </Link>
          <Link
            to="/sale/cash"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg shadow transition-colors"
          >
            <i className="pi pi-wallet text-xs"></i>
            নগদ বিক্রয়
          </Link>
        </div>
      </div>

      {/* 7. Official Signatures for Print Only */}
      <div className="hidden print-signatures grid-cols-3 gap-6 pt-12 mt-8 border-t border-gray-400 text-center text-xs print-break-inside-avoid">
        <div>
          <div className="border-t border-gray-700 pt-1.5 w-4/5 mx-auto">
            <p className="font-bold text-gray-900">গ্রাহকের স্বাক্ষর</p>
            <p className="text-[10px] text-gray-500">Customer Signature</p>
          </div>
        </div>
        <div>
          <div className="border-t border-gray-700 pt-1.5 w-4/5 mx-auto">
            <p className="font-bold text-gray-900">যাচাইকারী স্টাফ</p>
            <p className="text-[10px] text-gray-500">Verified By Staff</p>
          </div>
        </div>
        <div>
          <div className="border-t border-gray-700 pt-1.5 w-4/5 mx-auto">
            <p className="font-bold text-gray-900">ম্যানেজারের অনুমোদন</p>
            <p className="text-[10px] text-gray-500">Manager Authorization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
