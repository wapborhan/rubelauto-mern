import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import moment from "moment";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";
import useProdType from "../../hooks/data/useProdType";
import { useGetPurchaseQuery } from "../../redux/feature/api/purchaseApi";
import TableHeader from "../../components/shared/table/TableHeader";
import TablePagination from "../../components/shared/table/TablePagination";

const ViewPurchase = () => {
  const { data: stock, isLoading } = useGetPurchaseQuery();
  const [proTypeList] = useProdType();

  const [searchTerm, setSearchTerm] = useState("");
  const [showroomFilter, setShowroomFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const rawList = stock?.data || [];

  const uniqueShowrooms = useMemo(() => {
    return [...new Set(rawList.map((i) => i.showroomName))].filter(Boolean);
  }, [rawList]);

  const uniqueStatuses = useMemo(() => {
    return [...new Set(rawList.map((i) => i.stockStatus))].filter(Boolean);
  }, [rawList]);

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      if (showroomFilter && item.showroomName !== showroomFilter) return false;
      if (statusFilter && item.stockStatus !== statusFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const brand = (item.brandName || "").toLowerCase();
        const model = (item.modelName || "").toLowerCase();
        const sr = (item.showroomName || "").toLowerCase();
        const eng = (item.engine || "").toLowerCase();
        const chs = (item.chassis || "").toLowerCase();
        const col = (item.color || "").toLowerCase();

        if (
          !brand.includes(q) &&
          !model.includes(q) &&
          !sr.includes(q) &&
          !eng.includes(q) &&
          !chs.includes(q) &&
          !col.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rawList, showroomFilter, statusFilter, searchTerm]);

  const hasActiveFilters = Boolean(
    searchTerm || showroomFilter || statusFilter
  );

  const handleReset = () => {
    setSearchTerm("");
    setShowroomFilter("");
    setStatusFilter("");
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
        title="গাড়ি ক্রয় ও স্টক তালিকা (Vehicle Stock)"
        subtitle="শোরুমের বিদ্যমান স্টক, ইঞ্জিন ও চেসিস ট্র্যাকিং"
        searchTerm={searchTerm}
        setSearchTerm={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="মডেল, ইঞ্জিন, চেসিস বা কালার দিয়ে খুঁজুন..."
        totalCount={rawList.length}
        filteredCount={filteredData.length}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        filters={
          <div className="flex flex-wrap items-center gap-2">
            {/* Showroom filter */}
            <select
              value={showroomFilter}
              onChange={(e) => {
                setShowroomFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            >
              <option value="">সকল শোরুম</option>
              {uniqueShowrooms.map((sr) => (
                <option key={sr} value={sr}>
                  {sr}
                </option>
              ))}
            </select>

            {/* Condition/Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            >
              <option value="">সকল অবস্থা (Condition)</option>
              {uniqueStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <NavLink
              to="/purchase/add"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <i className="pi pi-plus text-xs"></i>
              নতুন ক্রয় এন্ট্রি
            </NavLink>
            <ExportButtons
              data={filteredData}
              fileName="vehicle-stock"
              title="Vehicle Stock List"
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
              স্টক ডাটা লোড হচ্ছে...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">ক্রঃ</th>
                  <th className="py-3 px-3.5">রিসিভ তারিখ</th>
                  <th className="py-3 px-3.5">ক্যাটেগরি</th>
                  <th className="py-3 px-3.5">মডেল নাম</th>
                  <th className="py-3 px-3.5">ইঞ্জিন নং</th>
                  <th className="py-3 px-3.5">চেসিস নং</th>
                  <th className="py-3 px-3.5">রং</th>
                  <th className="py-3 px-3.5">শোরুম</th>
                  <th className="py-3 px-3.5 text-center">স্টক সংখ্যা</th>
                  <th className="py-3 px-3.5 text-center">কন্ডিশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400">
                      <i className="pi pi-inbox text-3xl mb-2 block"></i>
                      কোনো স্টক তথ্য পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => {
                    const categoryObj = proTypeList?.find(
                      (item) => item?.sku === row?.categories
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
                        <td className="py-3 px-3.5 whitespace-nowrap text-gray-700 font-medium">
                          {row.receivedDate
                            ? moment(row.receivedDate).format("DD-MMM-YYYY")
                            : "—"}
                        </td>
                        <td className="py-3 px-3.5 text-gray-600 whitespace-nowrap">
                          {categoryObj?.name || row.categories || "—"}
                        </td>
                        <td className="py-3 px-3.5 font-bold text-gray-900 whitespace-nowrap">
                          {row.modelName || "—"}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-xs text-blue-700 whitespace-nowrap">
                          {row.engine || "—"}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-xs text-indigo-700 whitespace-nowrap">
                          {row.chassis || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-gray-600 whitespace-nowrap">
                          {row.color || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-gray-700 whitespace-nowrap">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                            {row.showroomName || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-center font-bold text-gray-800">
                          {row.stock ?? 1}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${
                              row.stockStatus === "New"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {row.stockStatus || "Active"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
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

export default ViewPurchase;
