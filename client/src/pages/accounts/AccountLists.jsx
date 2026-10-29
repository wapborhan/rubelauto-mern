import { useState, useMemo, useEffect } from "react";
import { useGetAccountQuery } from "../../redux/feature/api/accountApi";
import TableHeader from "../../components/shared/table/TableHeader";
import TablePagination from "../../components/shared/table/TablePagination";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";

const AccountLists = () => {
  const { data: allAccounts, refetch, isLoading } = useGetAccountQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const rawList = allAccounts || [];

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const name = (item.name || "").toLowerCase();
        const code = (item.code || "").toLowerCase();
        const balance = String(item.remainingBalance || "");

        if (!name.includes(q) && !code.includes(q) && !balance.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [rawList, searchTerm]);

  const summaryTotals = useMemo(() => {
    const totalBalance = filteredData.reduce(
      (sum, item) => sum + (Number(item.remainingBalance) || 0),
      0
    );
    return {
      count: filteredData.length,
      totalBalance,
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
        title="ব্যাংক ও আর্থিক অ্যাকাউন্ট তালিকা (Account List)"
        subtitle="শোরুমের আর্থিক অ্যাকাউন্ট ও ব্যালান্স বিবরণী"
        searchTerm={searchTerm}
        setSearchTerm={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="অ্যাকাউন্ট নাম, কোড বা ব্যালান্স দিয়ে খুঁজুন..."
        totalCount={rawList.length}
        filteredCount={filteredData.length}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        actions={
          <div className="flex items-center gap-2">
            <ExportButtons
              data={filteredData}
              fileName="accounts-list"
              title="Accounts List"
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
              অ্যাকাউন্টের তথ্য লোড হচ্ছে...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">ক্রঃ</th>
                  <th className="py-3 px-3.5">অ্যাকাউন্ট নাম (Account Name)</th>
                  <th className="py-3 px-3.5">অ্যাকাউন্ট কোড (Code)</th>
                  <th className="py-3 px-3.5 text-right">বর্তমান ব্যালান্স (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400">
                      <i className="pi pi-inbox text-3xl mb-2 block"></i>
                      কোনো অ্যাকাউন্টের তথ্য পাওয়া যায়নি
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
                        <td className="py-3 px-3.5 font-bold text-gray-900 whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-blue-700 whitespace-nowrap">
                          <span className="bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs">
                            {row.code}
                          </span>
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
                      colSpan={2}
                      className="py-3 px-3.5 text-right font-semibold text-gray-600"
                    >
                      মোট তহবিল ব্যালান্স (Total Balance):
                    </td>
                    <td className="py-3 px-3.5 text-right text-emerald-600 font-extrabold whitespace-nowrap">
                      ৳ {summaryTotals.totalBalance.toLocaleString()}
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

export default AccountLists;
