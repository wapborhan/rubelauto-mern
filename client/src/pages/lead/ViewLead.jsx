import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useGetLeadQuery } from "../../redux/feature/api/leadApi";
import TableHeader from "../../components/shared/table/TableHeader";
import TablePagination from "../../components/shared/table/TablePagination";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";

export default function ViewLead() {
  const { data: leads, isLoading } = useGetLeadQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const rawList = leads?.data || [];

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      if (statusFilter && item.status !== statusFilter) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const name = (item.name || "").toLowerCase();
        const coname = (item.coname || "").toLowerCase();
        const number = (item.number || "").toLowerCase();
        let addr = "";
        if (typeof item.address === "object" && item.address) {
          addr = [
            item.address.village,
            item.address.union,
            item.address.upazila,
            item.address.district,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        } else {
          addr = String(item.address || "").toLowerCase();
        }

        if (
          !name.includes(q) &&
          !coname.includes(q) &&
          !number.includes(q) &&
          !addr.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rawList, searchTerm, statusFilter]);

  const hasActiveFilters = Boolean(searchTerm || statusFilter);

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  // Pagination logic
  const totalItems = filteredData.length;
  const paginatedData = useMemo(() => {
    if (pageSize === "all") return filteredData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const formatAddress = (address) => {
    if (!address) return "—";
    if (typeof address === "object") {
      const parts = [
        address.village,
        address.union,
        address.upazila,
        address.district,
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "—";
    }
    return address;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Hot":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Warm":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Cold":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="w-full mx-auto space-y-0">
      {/* Table Header */}
      <TableHeader
        title="গ্রাহক লিডের তালিকা (Lead List)"
        subtitle="শোরুমের সম্ভাব্য ক্রেতা ও লিড ব্যবস্থাপনা"
        searchTerm={searchTerm}
        setSearchTerm={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="নাম, পিতা, মোবাইল বা ঠিকানা দিয়ে খুঁজুন..."
        totalCount={rawList.length}
        filteredCount={filteredData.length}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        filters={
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          >
            <option value="">সকল স্ট্যাটাস</option>
            <option value="Hot">Hot (সম্ভাব্য)</option>
            <option value="Warm">Warm (মাঝারি)</option>
            <option value="Cold">Cold (কম)</option>
          </select>
        }
        actions={
          <div className="flex items-center gap-2">
            <NavLink
              to="/contact/lead/add"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <i className="pi pi-plus text-xs"></i>
              নতুন লিড যুক্ত করুন
            </NavLink>
            <ExportButtons
              data={filteredData}
              fileName="leads"
              title="Customer Leads"
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
              লিড ডাটা লোড হচ্ছে...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">ক্রঃ</th>
                  <th className="py-3 px-3.5">স্ট্যাটাস</th>
                  <th className="py-3 px-3.5">নাম</th>
                  <th className="py-3 px-3.5">পিতার নাম</th>
                  <th className="py-3 px-3.5">নম্বর</th>
                  <th className="py-3 px-3.5">ঠিকানা</th>
                  <th className="py-3 px-3.5 text-center w-28">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      <i className="pi pi-inbox text-3xl mb-2 block"></i>
                      কোনো লিডের তথ্য পাওয়া যায়নি
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
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                              row.status
                            )}`}
                          >
                            {row.status || "Normal"}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-medium text-gray-900 whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="py-3 px-3.5 text-gray-600 whitespace-nowrap">
                          {row.coname || "—"}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-gray-700 whitespace-nowrap">
                          {row.number || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-gray-600 max-w-xs truncate">
                          {formatAddress(row.address)}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <NavLink
                              to={`/contact/lead/view/${row._id}`}
                              className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded border border-blue-200 transition-colors"
                              title="বিস্তারিত দেখুন"
                            >
                              <i className="pi pi-eye text-xs"></i>
                            </NavLink>
                            <NavLink
                              to={`/contact/lead/edit/${row._id}`}
                              className="p-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded border border-indigo-200 transition-colors"
                              title="সম্পাদনা করুন"
                            >
                              <i className="pi pi-file-edit text-xs"></i>
                            </NavLink>
                            {row.guarantor && row.guarantor.length > 0 ? (
                              <NavLink
                                to={`/contact/lead/edit/guarantor/${row._id}`}
                                className="p-1.5 text-amber-600 hover:text-white hover:bg-amber-600 rounded border border-amber-200 transition-colors"
                                title="জামিনদার আপডেট"
                              >
                                <i className="pi pi-pencil text-xs"></i>
                              </NavLink>
                            ) : (
                              <NavLink
                                to={`/contact/lead/add/guarantor/${row._id}`}
                                className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded border border-emerald-200 transition-colors"
                                title="জামিনদার যুক্ত করুন"
                              >
                                <i className="pi pi-plus text-xs"></i>
                              </NavLink>
                            )}
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
}
