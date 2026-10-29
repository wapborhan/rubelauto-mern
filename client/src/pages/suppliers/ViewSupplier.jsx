import { useState, useMemo, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetSupplierQuery } from "../../redux/feature/api/supplierApi";
import TableHeader from "../../components/shared/table/TableHeader";
import TablePagination from "../../components/shared/table/TablePagination";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";

export default function ViewSupplier() {
  const { pathname } = useLocation();
  const isParts = pathname === "/contact/supplier/parts/view";
  const { data: supplier, isLoading, refetch } = useGetSupplierQuery();
  const { showRoom } = useSelector((state) => state.userStore);

  const [searchTerm, setSearchTerm] = useState("");
  const [prodTypeFilter, setProdTypeFilter] = useState(isParts ? "Parts" : "");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    refetch();
  }, [pathname, refetch]);

  const rawList = useMemo(() => {
    const list = supplier?.data || [];
    if (isParts) {
      return list.filter((item) => item.prodType === "Parts");
    }
    return list;
  }, [supplier, isParts]);

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      if (!isParts && prodTypeFilter && item.prodType !== prodTypeFilter) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const bss = (item.bssName || "").toLowerCase();
        const emp = (item.empName || "").toLowerCase();
        const mob = (item.mobile || "").toLowerCase();
        const prod = (item.prodType || "").toLowerCase();

        if (
          !bss.includes(q) &&
          !emp.includes(q) &&
          !mob.includes(q) &&
          !prod.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rawList, isParts, prodTypeFilter, searchTerm]);

  // Summary Totals
  const summaryTotals = useMemo(() => {
    let openingSum = 0;
    let purchaseSum = 0;
    let paymentSum = 0;
    let balanceSum = 0;

    filteredData.forEach((s) => {
      openingSum += Number(s.openingBalance) || 0;
      purchaseSum += Number(s.totalPurchase) || 0;
      paymentSum += Number(s.totalPayment) || 0;
      balanceSum += Number(s.currentBalance) || 0;
    });

    return {
      count: filteredData.length,
      openingSum,
      purchaseSum,
      paymentSum,
      balanceSum,
    };
  }, [filteredData]);

  const hasActiveFilters = Boolean(searchTerm || (!isParts && prodTypeFilter));

  const handleReset = () => {
    setSearchTerm("");
    if (!isParts) setProdTypeFilter("");
    setCurrentPage(1);
  };

  // Pagination
  const totalItems = filteredData.length;
  const paginatedData = useMemo(() => {
    if (pageSize === "all") return filteredData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const getProductTypeBadge = (type) => {
    switch (type) {
      case "Motorcycle":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Parts":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Easybike":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "LPG":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-6 space-y-0">
      {/* Header */}
      <TableHeader
        title={
          isParts
            ? "পার্টস সরবরাহকারী তালিকা (Parts Suppliers)"
            : "সকল সরবরাহকারী তালিকা (All Suppliers)"
        }
        subtitle="সাপ্লায়ার ব্যালান্স, ক্রয় এবং পেমেন্ট ট্র্যাকিং"
        searchTerm={searchTerm}
        setSearchTerm={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="সরবরাহকারী, কর্মচারী বা মোবাইল দিয়ে খুঁজুন..."
        totalCount={rawList.length}
        filteredCount={filteredData.length}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        filters={
          !isParts && (
            <select
              value={prodTypeFilter}
              onChange={(e) => {
                setProdTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            >
              <option value="">সকল পণ্য ধরন</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Parts">Parts</option>
              <option value="Easybike">Easybike</option>
              <option value="LPG">LPG</option>
            </select>
          )
        }
        actions={
          <div className="flex items-center gap-2">
            <NavLink
              to="/contact/supplier/add"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <i className="pi pi-plus text-xs"></i>
              সাপ্লায়ার যুক্ত করুন
            </NavLink>
            <ExportButtons
              data={filteredData}
              fileName={isParts ? "parts-suppliers" : "suppliers"}
              title={isParts ? "Parts Suppliers List" : "All Suppliers List"}
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
              সরবরাহকারীর ডাটা লোড হচ্ছে...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">ক্রঃ</th>
                  {!isParts && <th className="py-3 px-3.5">পণ্য ধরন</th>}
                  <th className="py-3 px-3.5">সরবরাহকারী</th>
                  <th className="py-3 px-3.5">কর্মচারী</th>
                  <th className="py-3 px-3.5">নম্বর</th>
                  <th className="py-3 px-3.5 text-right">ওপেনিং ব্যালান্স</th>
                  <th className="py-3 px-3.5 text-right">মোট ক্রয়</th>
                  <th className="py-3 px-3.5 text-right">মোট পেমেন্ট</th>
                  <th className="py-3 px-3.5 text-right">বর্তমান বাকি</th>
                  <th className="py-3 px-3.5 text-center w-28">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isParts ? 9 : 10}
                      className="py-12 text-center text-gray-400"
                    >
                      <i className="pi pi-inbox text-3xl mb-2 block"></i>
                      কোনো সরবরাহকারীর তথ্য পাওয়া যায়নি
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
                        {!isParts && (
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getProductTypeBadge(
                                row.prodType
                              )}`}
                            >
                              {row.prodType || "—"}
                            </span>
                          </td>
                        )}
                        <td className="py-3 px-3.5 font-semibold text-gray-900 whitespace-nowrap">
                          {row.bssName}
                        </td>
                        <td className="py-3 px-3.5 text-gray-700 whitespace-nowrap">
                          {row.empName || "—"}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-gray-600 whitespace-nowrap">
                          {row.mobile || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-right font-medium text-gray-700 whitespace-nowrap">
                          ৳ {Number(row.openingBalance || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-3.5 text-right font-medium text-blue-700 whitespace-nowrap">
                          ৳ {Number(row.totalPurchase || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-3.5 text-right font-semibold text-emerald-600 whitespace-nowrap">
                          ৳ {Number(row.totalPayment || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-3.5 text-right whitespace-nowrap">
                          <span
                            className={`font-bold ${
                              (Number(row.currentBalance) || 0) > 0
                                ? "text-red-600"
                                : "text-gray-700"
                            }`}
                          >
                            ৳ {Number(row.currentBalance || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <NavLink
                              to={`/contact/supplier/view/${row._id}`}
                              className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded border border-blue-200 transition-colors"
                              title="বিস্তারিত বিবরণ"
                            >
                              <i className="pi pi-eye text-xs"></i>
                            </NavLink>
                            <NavLink
                              to={`/contact/supplier/payment/${row._id}`}
                              className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded border border-emerald-200 transition-colors"
                              title="পেমেন্ট প্রদান করুন"
                            >
                              <i className="pi pi-money-bill text-xs"></i>
                            </NavLink>
                            {showRoom !== "Parts" && (
                              <NavLink
                                to={`/contact/supplier/edit/${row._id}`}
                                className="p-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded border border-indigo-200 transition-colors"
                                title="সম্পাদনা করুন"
                              >
                                <i className="pi pi-file-edit text-xs"></i>
                              </NavLink>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Table Footer: Summary Totals */}
              {filteredData.length > 0 && (
                <tfoot className="bg-gray-100/90 border-t-2 border-gray-300 font-bold text-gray-800 text-xs md:text-sm">
                  <tr>
                    <td className="py-3 px-3.5 text-center">
                      {summaryTotals.count}
                    </td>
                    <td
                      colSpan={isParts ? 3 : 4}
                      className="py-3 px-3.5 text-right font-semibold text-gray-600"
                    >
                      মোট সর্বমোট (Total Summary):
                    </td>
                    <td className="py-3 px-3.5 text-right font-bold text-gray-800 whitespace-nowrap">
                      ৳ {summaryTotals.openingSum.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-right text-blue-700 font-extrabold whitespace-nowrap">
                      ৳ {summaryTotals.purchaseSum.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-right text-emerald-600 font-extrabold whitespace-nowrap">
                      ৳ {summaryTotals.paymentSum.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-right text-red-600 font-extrabold whitespace-nowrap">
                      ৳ {summaryTotals.balanceSum.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-center text-gray-400 font-normal">
                      -
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
}
