import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import useCostList from "../../hooks/data/useCostList";
import { useGetCostQuery } from "../../redux/feature/api/costApi";
import TableHeader from "../../components/shared/table/TableHeader";
import TablePagination from "../../components/shared/table/TablePagination";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";

const ViewCost = () => {
  const [costCatList] = useCostList();
  const { showRoom } = useSelector((state) => state.userStore);
  const { data: allCost, isLoading } = useGetCostQuery(showRoom);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const rawList = allCost?.data || [];

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      if (categoryFilter && item.categories !== categoryFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const catObj = costCatList.find((c) => c.code === item.categories);
        const catName = (catObj?.name || item.categories || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        const email = (item.staffEmail || "").toLowerCase();
        const amt = String(item.amount || "");
        const sr = (item.showRoom || "").toLowerCase();

        if (
          !catName.includes(q) &&
          !desc.includes(q) &&
          !email.includes(q) &&
          !amt.includes(q) &&
          !sr.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rawList, categoryFilter, searchTerm, costCatList]);

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

  const hasActiveFilters = Boolean(searchTerm || categoryFilter);

  const handleReset = () => {
    setSearchTerm("");
    setCategoryFilter("");
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
        title="খরচের বিবরণী তালিকা (Cost / Expenses)"
        subtitle="শোরুম ও অ্যাকাউন্টের যাবতীয় খরচ ট্র্যাকিং"
        searchTerm={searchTerm}
        setSearchTerm={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="খাত, বিবরণ, কর্মকর্তা বা খরচের টাকা দিয়ে খুঁজুন..."
        totalCount={rawList.length}
        filteredCount={filteredData.length}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        filters={
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          >
            <option value="">সকল খরচের খাত</option>
            {costCatList.map((cat) => (
              <option key={cat.code} value={cat.code}>
                {cat.name}
              </option>
            ))}
          </select>
        }
        actions={
          <div className="flex items-center gap-2">
            <NavLink
              to="/account/cost/add"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <i className="pi pi-plus text-xs"></i>
              নতুন খরচ যুক্ত করুন
            </NavLink>
            <ExportButtons
              data={filteredData}
              fileName="expenses-records"
              title="Expenses Records"
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
              খরচের তথ্য লোড হচ্ছে...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">ক্রঃ</th>
                  <th className="py-3 px-3.5">তারিখ</th>
                  <th className="py-3 px-3.5">খরচের খাত</th>
                  <th className="py-3 px-3.5">বিবরণ</th>
                  <th className="py-3 px-3.5">এন্ট্রি কর্মকর্তা</th>
                  <th className="py-3 px-3.5 text-right">খরচের পরিমাণ (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      <i className="pi pi-inbox text-3xl mb-2 block"></i>
                      কোনো খরচের তথ্য পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => {
                    const category = costCatList.find(
                      (inc) => inc.code === row.categories
                    );
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
                          {row.date
                            ? moment(row.date).format("DD-MMM-YYYY")
                            : "—"}
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            {category?.name || row.categories || "অন্যান্য"}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-gray-600 max-w-sm truncate">
                          {row.description || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-gray-600 text-xs whitespace-nowrap">
                          {row.staffEmail || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-right font-bold text-red-600 whitespace-nowrap">
                          ৳ {Number(row.amount || 0).toLocaleString()}
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
                      colSpan={4}
                      className="py-3 px-3.5 text-right font-semibold text-gray-600"
                    >
                      মোট খরচ (Total Expenses):
                    </td>
                    <td className="py-3 px-3.5 text-right text-red-600 font-extrabold whitespace-nowrap">
                      ৳ {summaryTotals.totalAmount.toLocaleString()}
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

export default ViewCost;
