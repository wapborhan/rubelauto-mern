import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  calculateCustomerDues,
  calculateSummaryTotals,
} from "./customerCalculations";
import SeizedBack from "./seized/SeizedBack";

const CustomerTable = ({ data = [], path = "running", isLoading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Summary Totals
  const summaryTotals = useMemo(() => calculateSummaryTotals(data), [data]);

  // Pagination logic
  const totalItems = data.length;
  const totalPages =
    pageSize === "all" ? 1 : Math.ceil(totalItems / pageSize) || 1;

  // Safe current page adjustment
  const activePage = Math.min(currentPage, totalPages) || 1;

  const paginatedData = useMemo(() => {
    if (pageSize === "all") return data;
    const startIndex = (activePage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, activePage, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 border-t-0 p-12 text-center">
        <i className="pi pi-spin pi-spinner text-3xl text-blue-600 mb-3 block"></i>
        <p className="text-sm font-medium text-gray-500">
          ডাটা লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
              <th className="py-3 px-3.5 text-center w-12">ক্রঃ</th>
              <th className="py-3 px-3.5">বিক্রি তারিখ</th>
              <th className="py-3 px-3.5">কার্ড নং</th>
              <th className="py-3 px-3.5">গ্রাহকের নাম</th>
              <th className="py-3 px-3.5">মোবাইল</th>
              <th className="py-3 px-3.5">মডেল</th>
              <th className="py-3 px-3.5 text-right">চুক্তির বকেয়া</th>
              <th className="py-3 px-3.5 text-center">কিস্তি ও জমা</th>
              <th className="py-3 px-3.5 text-center">অতিক্রান্ত মাস</th>
              <th className="py-3 px-3.5 text-right">কিস্তি দাবি (Dawa)</th>
              <th className="py-3 px-3.5">শোরুম</th>
              <th className="py-3 px-3.5 text-center w-28">অ্যাকশন</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-12 text-center text-gray-400">
                  <i className="pi pi-inbox text-3xl mb-2 block"></i>
                  কোনো কাস্টমার বা বিক্রয় তথ্য পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const dues = calculateCustomerDues(row);
                const absoluteIndex =
                  pageSize === "all"
                    ? index + 1
                    : (activePage - 1) * pageSize + index + 1;

                return (
                  <tr
                    key={row._id || row.cardno || index}
                    className="hover:bg-blue-50/40 odd:bg-white even:bg-gray-50/30 transition-colors"
                  >
                    {/* Index */}
                    <td className="py-3 px-3.5 text-center text-gray-500 font-mono text-xs">
                      {absoluteIndex}
                    </td>

                    {/* Sale Date */}
                    <td className="py-3 px-3.5 text-gray-700 font-medium text-xs whitespace-nowrap">
                      {row.saledate
                        ? moment(row.saledate).format("DD-MMM-YYYY")
                        : "N/A"}
                    </td>

                    {/* Card No */}
                    <td className="py-3 px-3.5 font-mono font-semibold text-blue-700 whitespace-nowrap">
                      {row.cardno}
                    </td>

                    {/* Customer Name */}
                    <td className="py-3 px-3.5 font-medium text-gray-900 whitespace-nowrap">
                      {row.customerInfo?.name || "N/A"}
                    </td>

                    {/* Mobile */}
                    <td className="py-3 px-3.5 text-gray-600 font-mono text-xs whitespace-nowrap">
                      {row.customerInfo?.number || "N/A"}
                    </td>

                    {/* Model */}
                    <td className="py-3 px-3.5 text-gray-800 font-medium whitespace-nowrap">
                      {row.productInfo?.models || row.productInfo?.type || "N/A"}
                    </td>

                    {/* Contract Due (চুক্তির বকেয়া) */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                       {dues.totalPrice > 0 && (
                        <div className="text-[11px] text-gray-400">
                          মোট চুক্তি: ৳ {dues.totalPrice.toLocaleString()}
                        </div>
                      )}
                      <div className="font-semibold text-gray-800">
                        ৳ {dues.totalContractDue.toLocaleString()}
                      </div>
                     
                    </td>

                    {/* Term & Paid Installments (চুক্তি কিস্তি ও জমা) */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <div className="text-[15px] font-semibold text-emerald-700">
                        {dues.paidCount} বার এ
                      </div>
                      
                      <div className="text-[11px] text-blue-600 font-medium">
                        মোট জমা: ৳ {dues.totalInstallmentPaid.toLocaleString()}
                      </div>
                    </td>

                    {/* Elapsed Months */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        চুক্তি: {dues.term ? `${dues.term} কিস্তি` : "—"}
                      </div>  
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          dues.isTermExpired
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        title={
                          dues.isTermExpired
                            ? "কিস্তির মেয়াদ শেষ"
                            : "বিক্রয় পরবর্তী অতিক্রান্ত মাস"
                        }
                      >
                        {dues.elapsedMonths} মাস
                      </span>
                    </td>

                    {/* Installment Due / Dawa (দাবি / কিস্তি বকেয়া) */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      {dues.installmentDue > 0 ? (
                        <div>{dues.dueInstallmentCount > 0 && (
                            <div className="text-[11px] text-red-500 font-medium">
                              {dues.dueInstallmentCount} কিস্তি বকেয়া
                            </div>
                          )}
                          <span className="font-bold text-red-600 text-sm">
                            ৳ {dues.installmentDue.toLocaleString()}
                          </span>
                          
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100 inline-block">
                            পরিশোধিত
                          </span>
                          {dues.advanceAmount > 0 && (
                            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                              +৳ {dues.advanceAmount.toLocaleString()} অগ্রিম
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Showroom */}
                    <td className="py-3 px-3.5 text-gray-600 text-xs whitespace-nowrap">
                      {row.showRoom || "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Details */}
                        {path !== "cash" && (
                          <Link
                            to={`/customer/view/${row.cardno}`}
                            className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded border border-blue-200 transition-colors"
                            title="বিস্তারিত বিবরণ"
                          >
                            <i className="pi pi-eye text-xs"></i>
                          </Link>
                        )}

                        {/* Running Actions: Payment & Seize */}
                        {path === "running" && (
                          <>
                            <Link
                              to={`/customer/payment/${row.cardno}`}
                              className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded border border-emerald-200 transition-colors"
                              title="কিস্তির টাকা জমা নিন"
                            >
                              <i className="pi pi-money-bill text-xs"></i>
                            </Link>

                            <Link
                              to={`/customer/seized/${row.cardno}`}
                              className="p-1.5 text-amber-600 hover:text-white hover:bg-amber-600 rounded border border-amber-200 transition-colors"
                              title="গাড়ি জব্দ করুন"
                            >
                              <i className="pi pi-lock text-xs"></i>
                            </Link>
                          </>
                        )}

                        {/* Mark as Paid */}
                        {(path === "cash" || path === "running") && (
                          <Link
                            to={`/customer/paid/${row.cardno}`}
                            className="p-1.5 text-purple-600 hover:text-white hover:bg-purple-600 rounded border border-purple-200 transition-colors"
                            title="পরিশোধিত তালিকাভুক্ত করুন"
                          >
                            <i className="pi pi-check-circle text-xs"></i>
                          </Link>
                        )}

                        {/* Seized Back */}
                        {path === "seized" && <SeizedBack data={row} />}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Footer: Summary Dues & Dawa */}
          {data.length > 0 && (
            <tfoot className="bg-gray-100/90 border-t-2 border-gray-300 font-bold text-gray-800 text-xs md:text-sm">
              <tr>
                <td className="py-3 px-3.5 text-center">
                  {summaryTotals.count}
                </td>
                <td
                  colSpan={5}
                  className="py-3 px-3.5 text-right font-semibold text-gray-600"
                >
                  মোট হিসাব (Total Summary):
                </td>
                <td className="py-3 px-3.5 text-right text-gray-900 font-extrabold whitespace-nowrap">
                  ৳ {summaryTotals.totalContractDueSum.toLocaleString()}
                </td>
                <td className="py-3 px-3.5 text-center text-blue-700 font-bold whitespace-nowrap">
                  মোট জমা: ৳ {summaryTotals.totalInstallmentPaidSum.toLocaleString()}
                </td>
                <td className="py-3 px-3.5 text-center text-gray-400 font-normal">
                  -
                </td>
                <td className="py-3 px-3.5 text-right text-red-600 font-extrabold whitespace-nowrap">
                  ৳ {summaryTotals.totalInstallmentDueSum.toLocaleString()}
                </td>
                <td
                  colSpan={2}
                  className="py-3 px-3.5 text-gray-500 font-normal text-xs"
                >
                  (মোট কিস্তি দাবি)
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination Controls */}
      {data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 bg-gray-50/50 text-xs">
          {/* Page size selector */}
          <div className="flex items-center gap-2 text-gray-600">
            <span>প্রতি পৃষ্ঠায় দেখান:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const val =
                  e.target.value === "all" ? "all" : Number(e.target.value);
                setPageSize(val);
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 rounded px-2 py-1 text-xs outline-none"
            >
              <option value={10}>১০</option>
              <option value={25}>২৫</option>
              <option value={50}>৫০</option>
              <option value={100}>১০০</option>
              <option value="all">সবগুলো (All)</option>
            </select>
            <span className="text-gray-400">|</span>
            <span>
              মোট <b>{totalItems}</b> টির মধ্যে{" "}
              <b>
                {pageSize === "all"
                  ? totalItems
                  : `${(activePage - 1) * pageSize + 1} - ${Math.min(
                      activePage * pageSize,
                      totalItems
                    )}`}
              </b>{" "}
              দেখাচ্ছে
            </span>
          </div>

          {/* Navigation buttons */}
          {pageSize !== "all" && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlePageChange(activePage - 1)}
                disabled={activePage === 1}
                className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                আগের পৃষ্ঠা
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 7) return true;
                    if (p === 1 || p === totalPages) return true;
                    return Math.abs(p - activePage) <= 1;
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const hasGap = prev && p - prev > 1;

                    return (
                      <span key={p} className="flex items-center">
                        {hasGap && (
                          <span className="px-1 text-gray-400">...</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handlePageChange(p)}
                          className={`w-7 h-7 text-xs font-semibold rounded transition-colors ${
                            activePage === p
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(activePage + 1)}
                disabled={activePage === totalPages}
                className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                পরের পৃষ্ঠা
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
