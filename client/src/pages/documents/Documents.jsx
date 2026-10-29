import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import { useGetCustomerQuery } from "../../redux/feature/api/customerApi";
import TableHeader from "../../components/shared/table/TableHeader";
import TablePagination from "../../components/shared/table/TablePagination";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";
import UpdateDocument from "./UpdateDocument";

const Documents = () => {
  const { showRoom } = useSelector((state) => state.userStore);
  const {
    data: customers,
    refetch,
    isLoading,
  } = useGetCustomerQuery({
    path: "paid",
    showRoom,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [docStatusFilter, setDocStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const rawList = customers?.data || [];

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      const docStatus = item.cardStatus?.docStatus || "pending";
      if (docStatusFilter && docStatus !== docStatusFilter) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const cardno = String(item.cardno || "").toLowerCase();
        const name = (item.customerInfo?.name || "").toLowerCase();
        const number = (item.customerInfo?.number || "").toLowerCase();
        const model = (item.productInfo?.models || "").toLowerCase();
        const engine = (item.productInfo?.engine || "").toLowerCase();
        const sr = (item.showRoom || "").toLowerCase();

        if (
          !cardno.includes(q) &&
          !name.includes(q) &&
          !number.includes(q) &&
          !model.includes(q) &&
          !engine.includes(q) &&
          !sr.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rawList, docStatusFilter, searchTerm]);

  const hasActiveFilters = Boolean(searchTerm || docStatusFilter);

  const handleReset = () => {
    setSearchTerm("");
    setDocStatusFilter("");
    setCurrentPage(1);
  };

  const totalItems = filteredData.length;
  const paginatedData = useMemo(() => {
    if (pageSize === "all") return filteredData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const getDocStatusBadge = (status) => {
    switch (status) {
      case "delivared":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "complete":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-6 space-y-0">
      {/* Header */}
      <TableHeader
        title="ডকুমেন্টস ও কাগজপত্র ব্যবস্থাপনা (Documents)"
        subtitle="পরিশোধিত কার্ডের কাগজপত্র সরবরাহ ও স্ট্যাটাস ট্র্যাকিং"
        searchTerm={searchTerm}
        setSearchTerm={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="কার্ড নং, গ্রাহক, মডেল বা ইঞ্জিন নং দিয়ে খুঁজুন..."
        totalCount={rawList.length}
        filteredCount={filteredData.length}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        filters={
          <select
            value={docStatusFilter}
            onChange={(e) => {
              setDocStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          >
            <option value="">সকল স্ট্যাটাস</option>
            <option value="pending">Pending (অপেক্ষমান)</option>
            <option value="complete">Complete (প্রস্তুত)</option>
            <option value="delivared">Delivered (বিতরণকৃত)</option>
          </select>
        }
        actions={
          <div className="flex items-center gap-2">
            <ExportButtons
              data={filteredData}
              fileName="paid-documents"
              title="Documents Management"
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
              ডকুমেন্টস ডাটা লোড হচ্ছে...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">ক্রঃ</th>
                  <th className="py-3 px-3.5">বিক্রি তারিখ</th>
                  <th className="py-3 px-3.5">কার্ড নং</th>
                  <th className="py-3 px-3.5">গ্রাহক</th>
                  <th className="py-3 px-3.5">মডেল</th>
                  <th className="py-3 px-3.5">ইঞ্জিন নং</th>
                  <th className="py-3 px-3.5">শোরুম</th>
                  <th className="py-3 px-3.5 text-center">ডকুমেন্ট স্ট্যাটাস</th>
                  <th className="py-3 px-3.5">স্ট্যাটাস তারিখ</th>
                  <th className="py-3 px-3.5 text-center w-28">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400">
                      <i className="pi pi-inbox text-3xl mb-2 block"></i>
                      কোনো ডকুমেন্টস তথ্য পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => {
                    const absoluteIndex =
                      pageSize === "all"
                        ? index + 1
                        : (currentPage - 1) * pageSize + index + 1;
                    const docStatus = row.cardStatus?.docStatus || "pending";
                    const statusDate =
                      row.cardStatus?.docDate || row.cardStatus?.paiddate;

                    return (
                      <tr
                        key={row._id || index}
                        className="hover:bg-blue-50/40 odd:bg-white even:bg-gray-50/30 transition-colors"
                      >
                        <td className="py-3 px-3.5 text-center text-gray-500 font-mono text-xs">
                          {absoluteIndex}
                        </td>
                        <td className="py-3 px-3.5 text-gray-700 font-medium text-xs whitespace-nowrap">
                          {row.saledate
                            ? moment(row.saledate).format("DD-MMM-YYYY")
                            : "—"}
                        </td>
                        <td className="py-3 px-3.5 font-mono font-semibold text-blue-700 whitespace-nowrap">
                          {row.cardno}
                        </td>
                        <td className="py-3 px-3.5 font-medium text-gray-900 whitespace-nowrap">
                          {row.customerInfo?.name || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-gray-800 whitespace-nowrap">
                          {row.productInfo?.models || "—"}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-xs text-gray-600 whitespace-nowrap">
                          {row.productInfo?.engine || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-gray-600 whitespace-nowrap">
                          {row.showRoom || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getDocStatusBadge(
                              docStatus
                            )}`}
                          >
                            {docStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-gray-600 text-xs whitespace-nowrap">
                          {statusDate
                            ? moment(statusDate).format("DD-MMM-YYYY")
                            : "—"}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <NavLink
                              to={`/customer/view/${row.cardno}`}
                              className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded border border-blue-200 transition-colors"
                              title="বিস্তারিত বিবরণ"
                            >
                              <i className="pi pi-eye text-xs"></i>
                            </NavLink>
                            <UpdateDocument data={row} refetch={refetch} />
                          </div>
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

export default Documents;
