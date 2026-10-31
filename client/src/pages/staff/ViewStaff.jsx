import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import { useGetUsersQuery } from "../../redux/feature/api/userApi";
import TableHeader from "../../components/shared/table/TableHeader";
import TablePagination from "../../components/shared/table/TablePagination";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";

const ViewStaff = () => {
  const { data: staff, isLoading } = useGetUsersQuery();
  const { userType: currentUserType } = useSelector((state) => state.userStore);

  const [searchTerm, setSearchTerm] = useState("");
  const [showroomFilter, setShowroomFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const rawList = staff?.data || [];

  const uniqueShowrooms = useMemo(() => {
    return [...new Set(rawList.map((i) => i.showRoom))].filter(Boolean);
  }, [rawList]);

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      if (showroomFilter && item.showRoom !== showroomFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const name = (item.name || "").toLowerCase();
        const email = (item.email || "").toLowerCase();
        const mobile = (item.mobile || "").toLowerCase();
        const desig = (item.designation || "").toLowerCase();
        const sr = (item.showRoom || "").toLowerCase();

        if (
          !name.includes(q) &&
          !email.includes(q) &&
          !mobile.includes(q) &&
          !desig.includes(q) &&
          !sr.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rawList, showroomFilter, searchTerm]);

  const hasActiveFilters = Boolean(searchTerm || showroomFilter);

  const handleReset = () => {
    setSearchTerm("");
    setShowroomFilter("");
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
        title="কর্মকর্তা ও স্টাফ তালিকা (Staff & Users)"
        subtitle="শোরুমের কর্মচারী, পদবী ও অ্যাক্সেস ব্যবস্থাপনা"
        searchTerm={searchTerm}
        setSearchTerm={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="নাম, ইমেইল, মোবাইল বা পদবী দিয়ে খুঁজুন..."
        totalCount={rawList.length}
        filteredCount={filteredData.length}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        filters={
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
        }
        actions={
          <div className="flex items-center gap-2">
            <ExportButtons
              data={filteredData}
              fileName="staff-list"
              fields={[
                { label: "নাম", key: "name" },
                { label: "মোবাইল", key: "mobile" },
                { label: "ইমেইল", key: "email" },
                { label: "শোরুম", key: "showRoom" },
                { label: "পদবী", key: "designation" },
                { label: "ভূমিকা (Role)", key: "userType" },
                {
                  label: "যোগদানের তারিখ",
                  key: "joinDate",
                  format: (v) => (v ? moment(v).format("DD-MMM-YYYY") : "—"),
                },
              ]}
            />
          </div>
        }
      />

      {/* Table Container */}
      <div className="bg-white border-x border-b border-gray-200 rounded-b-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            <i className="pi pi-spin pi-spinner mr-2"></i>
            স্টাফ তথ্য লোড হচ্ছে...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/75 text-xs text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th scope="col" className="py-3 px-3.5 text-center w-12 font-bold">
                    #
                  </th>
                  <th scope="col" className="py-3 px-3.5 font-bold">
                    যোগদান তারিখ
                  </th>
                  <th scope="col" className="py-3 px-3.5 font-bold">
                    নাম
                  </th>
                  <th scope="col" className="py-3 px-3.5 font-bold">
                    মোবাইল
                  </th>
                  <th scope="col" className="py-3 px-3.5 font-bold">
                    ইমেইল
                  </th>
                  <th scope="col" className="py-3 px-3.5 font-bold">
                    শোরুম
                  </th>
                  <th scope="col" className="py-3 px-3.5 font-bold">
                    পদবী
                  </th>
                  <th scope="col" className="py-3 px-3.5 text-center font-bold">
                    স্ট্যাটাস / রোল
                  </th>
                  <th scope="col" className="py-3 px-3.5 text-center font-bold w-24">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="py-8 text-center text-gray-400 font-medium"
                    >
                      কোনো কর্মকর্তার তথ্য পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => {
                    const absoluteIndex =
                      pageSize === "all"
                        ? index + 1
                        : (currentPage - 1) * pageSize + index + 1;

                    const isUserRole = row.userType === "user" || !row.userType;
                    const isAdminRole = row.userType === "admin";

                    return (
                      <tr
                        key={row._id || row.email || index}
                        className="hover:bg-blue-50/40 odd:bg-white even:bg-gray-50/30 transition-colors"
                      >
                        <td className="py-3 px-3.5 text-center text-gray-500 font-mono text-xs">
                          {absoluteIndex}
                        </td>
                        <td className="py-3 px-3.5 text-gray-700 font-medium text-xs whitespace-nowrap">
                          {row.joinDate
                            ? moment(row.joinDate).format("DD-MMM-YYYY")
                            : "—"}
                        </td>
                        <td className="py-3 px-3.5 font-bold text-gray-900 whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-gray-700 whitespace-nowrap">
                          {row.mobile || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-gray-600 text-xs whitespace-nowrap">
                          {row.email || "—"}
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded text-xs font-semibold">
                            {row.showRoom || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-gray-800 font-medium whitespace-nowrap">
                          {row.designation || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          {isUserRole ? (
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              অননুমোদিত (Pending)
                            </span>
                          ) : isAdminRole ? (
                            <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              অ্যাডমিন
                            </span>
                          ) : (
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              স্টাফ
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <NavLink
                              to={`/profile/details?email=${row?.email}`}
                              className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded border border-blue-200 transition-colors"
                              title="প্রোফাইল দেখুন"
                            >
                              <i className="pi pi-eye text-xs"></i>
                            </NavLink>

                            {/* Only Admin can edit staff and change roles/approve */}
                            {currentUserType === "admin" && (
                              <NavLink
                                to={`/staff/edit/${row?.email}`}
                                className={`p-1.5 rounded border transition-colors ${
                                  isUserRole
                                    ? "text-amber-700 bg-amber-50 hover:bg-amber-600 hover:text-white border-amber-300 font-bold"
                                    : "text-indigo-600 hover:text-white hover:bg-indigo-600 border-indigo-200"
                                }`}
                                title={isUserRole ? "অ্যাকাউন্ট অনুমোদন করুন" : "সম্পাদনা করুন"}
                              >
                                <i className="pi pi-pencil text-xs"></i>
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
};

export default ViewStaff;
