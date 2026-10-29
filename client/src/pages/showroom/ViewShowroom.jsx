import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetShowroomQuery } from "../../redux/feature/api/showroomApi";
import TableHeader from "../../components/shared/table/TableHeader";
import TablePagination from "../../components/shared/table/TablePagination";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";

const ViewShowroom = () => {
  const { data: allShowroom = [], isLoading } = useGetShowroomQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const rawList = allShowroom || [];

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const name = (item.name || "").toLowerCase();
        const code = (item.code || "").toLowerCase();
        const addr = (item.address || "").toLowerCase();

        if (!name.includes(q) && !code.includes(q) && !addr.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [rawList, searchTerm]);

  const summaryTotals = useMemo(() => {
    let cashDueSum = 0;
    let percentDueSum = 0;
    let totalDueSum = 0;
    let balanceSum = 0;

    filteredData.forEach((s) => {
      const cash = Number(s.cashDue) || 0;
      const percent = Number(s.percentDue) || 0;
      const bal = Number(s.remainingBalance) || 0;
      cashDueSum += cash;
      percentDueSum += percent;
      totalDueSum += cash + percent;
      balanceSum += bal;
    });

    return {
      count: filteredData.length,
      cashDueSum,
      percentDueSum,
      totalDueSum,
      balanceSum,
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
        title="শোরুমের তালিকা (Showrooms)"
        subtitle="শোরুমভিত্তিক নগদ বকেয়া, পার্সেন্ট বকেয়া ও ব্যালান্স ট্র্যাকিং"
        searchTerm={searchTerm}
        setSearchTerm={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="শোরুমের নাম, কোড বা ঠিকানা দিয়ে খুঁজুন..."
        totalCount={rawList.length}
        filteredCount={filteredData.length}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/showroom/add"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <i className="pi pi-plus text-xs"></i>
              শোরুম যোগ করুন
            </Link>
            <ExportButtons
              data={filteredData}
              fileName="showrooms"
              title="Showrooms List"
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
              শোরুমের ডাটা লোড হচ্ছে...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">ক্রঃ</th>
                  <th className="py-3 px-3.5">শোরুমের নাম</th>
                  <th className="py-3 px-3.5">কোড</th>
                  <th className="py-3 px-3.5">ঠিকানা</th>
                  <th className="py-3 px-3.5 text-right">নগদ বকেয়া (Cash Due)</th>
                  <th className="py-3 px-3.5 text-right">পার্সেন্ট বকেয়া (Percent Due)</th>
                  <th className="py-3 px-3.5 text-right">সর্বমোট বকেয়া (Total Due)</th>
                  <th className="py-3 px-3.5 text-right">ব্যালান্স (Balance)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      <i className="pi pi-inbox text-3xl mb-2 block"></i>
                      কোনো শোরুমের তথ্য পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => {
                    const cash = Number(row.cashDue) || 0;
                    const percent = Number(row.percentDue) || 0;
                    const totalDue = cash + percent;
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
                        <td className="py-3 px-3.5 font-bold text-gray-900 whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-blue-700 whitespace-nowrap">
                          <span className="bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs font-semibold">
                            {row.code}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-gray-600 max-w-xs truncate">
                          {row.address || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-right font-medium text-gray-700 whitespace-nowrap">
                          ৳ {cash.toLocaleString()}
                        </td>
                        <td className="py-3 px-3.5 text-right font-medium text-gray-700 whitespace-nowrap">
                          ৳ {percent.toLocaleString()}
                        </td>
                        <td className="py-3 px-3.5 text-right font-bold text-red-600 whitespace-nowrap">
                          ৳ {totalDue.toLocaleString()}
                        </td>
                        <td className="py-3 px-3.5 text-right font-bold text-emerald-600 whitespace-nowrap">
                          ৳ {Number(row.remainingBalance || 0).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Table Footer */}
              {filteredData.length > 0 && (
                <tfoot className="bg-gray-100/90 border-t-2 border-gray-300 font-bold text-gray-800 text-xs md:text-sm">
                  <tr>
                    <td className="py-3 px-3.5 text-center">
                      {summaryTotals.count}
                    </td>
                    <td
                      colSpan={3}
                      className="py-3 px-3.5 text-right font-semibold text-gray-600"
                    >
                      মোট হিসাব (Total Summary):
                    </td>
                    <td className="py-3 px-3.5 text-right text-gray-800 whitespace-nowrap">
                      ৳ {summaryTotals.cashDueSum.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-right text-gray-800 whitespace-nowrap">
                      ৳ {summaryTotals.percentDueSum.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-right text-red-600 font-extrabold whitespace-nowrap">
                      ৳ {summaryTotals.totalDueSum.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-right text-emerald-600 font-extrabold whitespace-nowrap">
                      ৳ {summaryTotals.balanceSum.toLocaleString()}
                    </td>
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

export default ViewShowroom;
