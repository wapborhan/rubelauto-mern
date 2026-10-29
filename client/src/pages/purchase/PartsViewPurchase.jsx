import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import { useGetPartsPurchaseQuery } from "../../redux/feature/api/purchaseApi";
import TableHeader from "../../components/shared/table/TableHeader";
import TablePagination from "../../components/shared/table/TablePagination";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";

const PartsViewPurchase = () => {
  const { data: partsMemoList, isLoading } = useGetPartsPurchaseQuery();
  const { showRoom } = useSelector((state) => state.userStore);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const rawList = partsMemoList?.data || [];

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const bss = (item.supplier?.bssName || "").toLowerCase();
        const memo = String(item.MemoNo || "").toLowerCase();
        const trans = (item.transport || "").toLowerCase();
        const amt = String(item.amount || "");

        if (
          !bss.includes(q) &&
          !memo.includes(q) &&
          !trans.includes(q) &&
          !amt.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rawList, searchTerm]);

  const summaryTotals = useMemo(() => {
    const totalAmount = filteredData.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );
    return {
      count: filteredData.length,
      totalAmount,
    };
  }, [filteredData]);

  const hasActiveFilters = Boolean(searchTerm);

  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const totalItems = filteredData.length;
  const paginatedData = useMemo(() => {
    if (pageSize === "all") return filteredData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="w-full mx-auto p-4 md:p-6 space-y-0">
      {/* Header */}
      <TableHeader
        title="পার্টস ক্রয় ও মেমো তালিকা (Parts Purchase)"
        subtitle="খুচরা ও পাইকারি যন্ত্রাংশ ক্রয়ের বিবরণী"
        searchTerm={searchTerm}
        setSearchTerm={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="সাপ্লায়ার, মেমো নং বা পরিবহন দিয়ে খুঁজুন..."
        totalCount={rawList.length}
        filteredCount={filteredData.length}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        actions={
          <div className="flex items-center gap-2">
            <NavLink
              to="/purchase/parts/add"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <i className="pi pi-plus text-xs"></i>
              নতুন পার্টস ক্রয়
            </NavLink>
            <ExportButtons
              data={filteredData}
              fileName="parts-purchases"
              title="Parts Purchases"
            />
          </div>
        }
      />

      {/* Table Container */}
      <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="p-12 text-center">
            <i className="pi pi-spin pi-spinner text-3xl text-blue-600 mb-3 block"></i>
            <p className="text-sm font-medium text-gray-500">
              পার্টস ক্রয়ের ডাটা লোড হচ্ছে...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">ক্রঃ</th>
                  <th className="py-3 px-3.5">মেমো তারিখ</th>
                  <th className="py-3 px-3.5">সাপ্লায়ার</th>
                  <th className="py-3 px-3.5">মেমো নম্বর</th>
                  <th className="py-3 px-3.5">গ্রহণ তারিখ</th>
                  <th className="py-3 px-3.5">পরিবহন</th>
                  <th className="py-3 px-3.5 text-right">পরিমাণ (৳)</th>
                  {showRoom !== "Parts" && (
                    <th className="py-3 px-3.5 text-center w-28">অ্যাকশন</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={showRoom !== "Parts" ? 8 : 7}
                      className="py-12 text-center text-gray-400"
                    >
                      <i className="pi pi-inbox text-3xl mb-2 block"></i>
                      কোনো পার্টস ক্রয়ের তথ্য পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => {
                    const absoluteIndex =
                      pageSize === "all"
                        ? index + 1
                        : (currentPage - 1) * pageSize + index + 1;

                    return (
                      <tr
                        key={row._id || index}
                        className="hover:bg-blue-50/40 odd:bg-white even:bg-gray-50/30 transition-colors"
                      >
                        <td className="py-3 px-3.5 text-center text-gray-500 font-mono text-xs">
                          {absoluteIndex}
                        </td>
                        <td className="py-3 px-3.5 text-gray-700 font-medium text-xs whitespace-nowrap">
                          {row.memoDate
                            ? moment(row.memoDate).format("DD-MMM-YYYY")
                            : "—"}
                        </td>
                        <td className="py-3 px-3.5 font-bold text-gray-900 whitespace-nowrap">
                          {row.supplier?.bssName || "—"}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-blue-700 whitespace-nowrap">
                          {row.MemoNo || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-gray-700 text-xs whitespace-nowrap">
                          {row.receivedDate
                            ? moment(row.receivedDate).format("DD-MMM-YYYY")
                            : "—"}
                        </td>
                        <td className="py-3 px-3.5 text-gray-600 whitespace-nowrap">
                          {row.transport || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-right font-bold text-gray-800 whitespace-nowrap">
                          ৳ {Number(row.amount || 0).toLocaleString()}
                        </td>
                        {showRoom !== "Parts" && (
                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            <NavLink
                              to={`/contact/supplier/edit/${row?._id}`}
                              className="p-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded border border-indigo-200 transition-colors inline-block"
                              title="সম্পাদনা করুন"
                            >
                              <i className="pi pi-file-edit text-xs"></i>
                            </NavLink>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Footer Summary */}
              {filteredData.length > 0 && (
                <tfoot className="bg-gray-100/90 border-t-2 border-gray-300 font-bold text-gray-800 text-xs md:text-sm">
                  <tr>
                    <td className="py-3 px-3.5 text-center">
                      {summaryTotals.count}
                    </td>
                    <td
                      colSpan={5}
                      className="py-3 px-3.5 text-right font-semibold text-gray-600"
                    >
                      মোট ক্রয় মূল্য (Total Amount):
                    </td>
                    <td className="py-3 px-3.5 text-right text-emerald-600 font-extrabold whitespace-nowrap">
                      ৳ {summaryTotals.totalAmount.toLocaleString()}
                    </td>
                    {showRoom !== "Parts" && (
                      <td className="py-3 px-3.5 text-center text-gray-400 font-normal">
                        -
                      </td>
                    )}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        {/* Pagination */}
        <TablePagination
          totalItems={totalItems}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default PartsViewPurchase;
