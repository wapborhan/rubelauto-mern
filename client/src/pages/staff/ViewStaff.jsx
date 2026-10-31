import { useState, useMemo, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import { Toast } from "primereact/toast";
import {
  useGetUsersQuery,
  useSetUpdateUserMutation,
} from "../../redux/feature/api/userApi";
import { useGetShowroomQuery } from "../../redux/feature/api/showroomApi";
import useDesignationList from "../../hooks/data/useDesignationList";
import TableHeader from "../../components/shared/table/TableHeader";
import TablePagination from "../../components/shared/table/TablePagination";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";

const ViewStaff = () => {
  const toast = useRef(null);
  const { data: staff, isLoading } = useGetUsersQuery();
  const { data: showRooms } = useGetShowroomQuery();
  const [designationList] = useDesignationList();
  const [updateUser, { isLoading: isUpdatingUser }] = useSetUpdateUserMutation();

  const { userType: currentUserType, email: currentUserEmail } = useSelector(
    (state) => state.userStore
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showroomFilter, setShowroomFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Quick Approval Modal State
  const [approveModalUser, setApproveModalUser] = useState(null);
  const [modalRole, setModalRole] = useState("staff");
  const [modalShowroom, setModalShowroom] = useState("");
  const [modalDesignation, setModalDesignation] = useState("");

  // Unapprove Confirmation Modal State
  const [unapproveModalUser, setUnapproveModalUser] = useState(null);

  const rawList = staff?.data || [];

  const uniqueShowrooms = useMemo(() => {
    return [...new Set(rawList.map((i) => i.showRoom))].filter(Boolean);
  }, [rawList]);

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      if (showroomFilter && item.showRoom !== showroomFilter) return false;
      if (roleFilter) {
        if (roleFilter === "pending" && item.userType && item.userType !== "user")
          return false;
        if (roleFilter === "staff" && item.userType !== "staff") return false;
        if (roleFilter === "admin" && item.userType !== "admin") return false;
      }
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
  }, [rawList, showroomFilter, roleFilter, searchTerm]);

  const hasActiveFilters = Boolean(searchTerm || showroomFilter || roleFilter);

  const handleReset = () => {
    setSearchTerm("");
    setShowroomFilter("");
    setRoleFilter("");
    setCurrentPage(1);
  };

  const totalItems = filteredData.length;
  const paginatedData = useMemo(() => {
    if (pageSize === "all") return filteredData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Open Approval Dialog
  const openApproveModal = (user) => {
    setApproveModalUser(user);
    setModalRole("staff");
    setModalShowroom(user?.showRoom || (showRooms?.[0]?.name || ""));
    setModalDesignation(user?.designation || (designationList?.[0]?.code || ""));
  };

  // Instant 1-Click Approve directly as staff
  const handleInstantApprove = async (user) => {
    try {
      await updateUser({
        email: user.email,
        userInfo: {
          ...user,
          userType: "staff",
          isUpdated: true,
        },
      }).unwrap();

      toast.current?.show({
        severity: "success",
        summary: "অনুমোদিত!",
        detail: `${user.name || user.email} সফলভাবে স্টাফ হিসেবে অনুমোদিত হয়েছে`,
        life: 2500,
      });
    } catch (err) {
      console.error("Approval error:", err);
      toast.current?.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: err?.data?.message || "অনুমোদন করতে সমস্যা হয়েছে",
        life: 3000,
      });
    }
  };

  // Confirm Approval from Modal with custom showroom / designation
  const handleConfirmModalApprove = async () => {
    if (!approveModalUser) return;

    try {
      await updateUser({
        email: approveModalUser.email,
        userInfo: {
          ...approveModalUser,
          userType: modalRole,
          showRoom: modalShowroom,
          designation: modalDesignation,
          isUpdated: true,
        },
      }).unwrap();

      toast.current?.show({
        severity: "success",
        summary: "সফল",
        detail: `${approveModalUser.name || approveModalUser.email} এর অ্যাকাউন্ট ও রোল সফলভাবে অনুমোদিত হয়েছে`,
        life: 2500,
      });
      setApproveModalUser(null);
    } catch (err) {
      console.error("Custom approval error:", err);
      toast.current?.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: err?.data?.message || "অনুমোদন সংরক্ষণ করতে সমস্যা হয়েছে",
        life: 3000,
      });
    }
  };

  // Confirm Unapproval (Revert user to userType: 'user')
  const handleConfirmUnapprove = async () => {
    if (!unapproveModalUser) return;

    try {
      await updateUser({
        email: unapproveModalUser.email,
        userInfo: {
          ...unapproveModalUser,
          userType: "user",
          isUpdated: false,
        },
      }).unwrap();

      toast.current?.show({
        severity: "warn",
        summary: "অনুমোদন প্রত্যাহার!",
        detail: `${unapproveModalUser.name || unapproveModalUser.email} এর অনুমোদন বাতিল করে পেন্ডিং করা হয়েছে`,
        life: 2500,
      });
      setUnapproveModalUser(null);
    } catch (err) {
      console.error("Unapproval error:", err);
      toast.current?.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: err?.data?.message || "অনুমোদন বাতিল করতে সমস্যা হয়েছে",
        life: 3000,
      });
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-6 space-y-0">
      <Toast ref={toast} />

      {/* Header */}
      <TableHeader
        title="কর্মকর্তা ও স্টাফ তালিকা (Staff & Users)"
        subtitle="শোরুমের কর্মচারী, পদবী ও অ্যাক্সেস অনুমোদন ব্যবস্থাপনা"
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
          <div className="flex flex-wrap items-center gap-2">
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

            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            >
              <option value="">সকল স্ট্যাটাস</option>
              <option value="pending">অননুমোদিত (Pending)</option>
              <option value="staff">স্টাফ (Staff)</option>
              <option value="admin">অ্যাডমিন (Admin)</option>
            </select>
          </div>
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
                  <th scope="col" className="py-3 px-3.5 text-center font-bold min-w-[170px]">
                    অ্যাকশন ও অনুমোদন
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
                    const isSelf = Boolean(
                      currentUserEmail &&
                      row?.email &&
                      currentUserEmail.toLowerCase() === row.email.toLowerCase()
                    );

                    return (
                      <tr
                        key={row._id || row.email || index}
                        className={`transition-colors ${
                          isUserRole
                            ? "bg-amber-50/30 hover:bg-amber-50/60"
                            : "hover:bg-blue-50/40 odd:bg-white even:bg-gray-50/30"
                        }`}
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
                          <div className="flex items-center gap-2">
                            {row.photo ? (
                              <img
                                src={row.photo}
                                alt={row.name || "avatar"}
                                className="w-6 h-6 rounded-full object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                                {(row.name || "U")[0].toUpperCase()}
                              </div>
                            )}
                            <span>{row.name}</span>
                          </div>
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
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                              অননুমোদিত
                            </span>
                          ) : isAdminRole ? (
                            <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              অ্যাডমিন
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              স্টাফ (সক্রিয়)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Profile View */}
                            <NavLink
                              to={`/profile/details?email=${row?.email}`}
                              className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg border border-blue-200 transition-colors"
                              title="প্রোফাইল দেখুন"
                            >
                              <i className="pi pi-eye text-xs"></i>
                            </NavLink>

                            {/* DIRECT APPROVE BUTTON (When user is unapproved) */}
                            {currentUserType === "admin" && isUserRole && (
                              <button
                                type="button"
                                onClick={() => openApproveModal(row)}
                                disabled={isUpdatingUser}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                                title="এখানে ক্লিক করে সরাসরি অনুমোদন করুন"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>অনুমোদন করুন</span>
                              </button>
                            )}

                            {/* DIRECT UNAPPROVE BUTTON (When user is already approved) */}
                            {currentUserType === "admin" && !isUserRole && (
                              <button
                                type="button"
                                onClick={() => setUnapproveModalUser(row)}
                                disabled={isUpdatingUser || isSelf}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                                  isSelf
                                    ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
                                    : "text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-600 hover:text-white active:scale-[0.98] cursor-pointer"
                                }`}
                                title={
                                  isSelf
                                    ? "নিজের অ্যাডমিন অ্যাকাউন্ট বাতিল করা যাবে না"
                                    : "ক্লিক করে অনুমোদন বাতিল (Unapprove) করুন"
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                  />
                                </svg>
                                <span>অনুমোদন বাতিল</span>
                              </button>
                            )}

                            {/* Edit Link (Admin Only) */}
                            {currentUserType === "admin" && (
                              <NavLink
                                to={`/staff/edit/${row?.email}`}
                                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                                title="সম্পাদনা করুন"
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

      {/* QUICK APPROVE MODAL (Opens right on this page without navigating) */}
      {approveModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    স্টাফ অ্যাকাউন্ট অনুমোদন
                  </h3>
                  <p className="text-[11px] text-emerald-100">
                    এখানেই সরাসরি অনুমোদন সম্পন্ন করুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setApproveModalUser(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* User preview */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                {approveModalUser.photo ? (
                  <img
                    src={approveModalUser.photo}
                    alt={approveModalUser.name}
                    className="w-12 h-12 rounded-full object-cover border border-white shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-base flex items-center justify-center">
                    {(approveModalUser.name || "U")[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate">
                    {approveModalUser.name || "User"}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {approveModalUser.email}
                  </p>
                  <span className="inline-block mt-0.5 text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    অননুমোদিত (Pending)
                  </span>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  রোল নির্ধারণ করুন (Role)
                </label>
                <select
                  value={modalRole}
                  onChange={(e) => setModalRole(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
                >
                  <option value="staff">স্টাফ (Staff — শোরুম ও অপারেশনাল অ্যাক্সেস)</option>
                  <option value="admin">সিস্টেম অ্যাডমিন (Admin — পূর্ণ পারমিশন)</option>
                </select>
              </div>

              {/* Showroom Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  নিযুক্ত শোরুম শাখা (Showroom)
                </label>
                <select
                  value={modalShowroom}
                  onChange={(e) => setModalShowroom(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
                >
                  <option value="">শোরুম নির্বাচন করুন (ঐচ্ছিক)</option>
                  {(showRooms || []).map((sr) => (
                    <option key={sr.name || sr.code} value={sr.name}>
                      {sr.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Designation Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  পদবী (Designation)
                </label>
                <select
                  value={modalDesignation}
                  onChange={(e) => setModalDesignation(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
                >
                  <option value="">পদবী নির্বাচন করুন (ঐচ্ছিক)</option>
                  {(designationList || []).map((des) => (
                    <option key={des.code} value={des.name || des.code}>
                      {des.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleConfirmModalApprove}
                  disabled={isUpdatingUser}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isUpdatingUser ? (
                    <span>অনুমোদন করা হচ্ছে...</span>
                  ) : (
                    <span>✓ অনুমোদন নিশ্চিত করুন (Confirm Approve)</span>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleInstantApprove(approveModalUser);
                      setApproveModalUser(null);
                    }}
                    disabled={isUpdatingUser}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                  >
                    ডিফল্ট স্টাফ হিসেবে ১-ক্লিক অনুমোদন
                  </button>

                  <button
                    type="button"
                    onClick={() => setApproveModalUser(null)}
                    className="py-2 px-4 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK UNAPPROVE CONFIRMATION MODAL */}
      {unapproveModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 to-red-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    অনুমোদন বাতিল নিশ্চিতকরণ
                  </h3>
                  <p className="text-[11px] text-rose-100">
                    স্টাফ অ্যাক্সেস বন্ধ ও অ্যাকাউন্ট আন-এপ্রুভ করুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setUnapproveModalUser(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50/60 border border-rose-200">
                {unapproveModalUser.photo ? (
                  <img
                    src={unapproveModalUser.photo}
                    alt={unapproveModalUser.name}
                    className="w-12 h-12 rounded-full object-cover border border-white shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 font-bold text-base flex items-center justify-center">
                    {(unapproveModalUser.name || "U")[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate">
                    {unapproveModalUser.name || "User"}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {unapproveModalUser.email}
                  </p>
                  <span className="inline-block mt-0.5 text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    বর্তমান রোল: {unapproveModalUser.userType === "admin" ? "অ্যাডমিন" : "স্টাফ"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                আপনি কি নিশ্চিত যে আপনি এই ব্যবহারকারীর অনুমোদন বাতিল করতে চান? অনুমোদন বাতিল করলে তিনি আর ড্যাশবোর্ডে প্রবেশ করতে পারবেন না এবং সরাসরি এক্টিভেশন পেন্ডিং (Permission) পেজে রিডাইরেক্ট হবেন।
              </p>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setUnapproveModalUser(null)}
                  disabled={isUpdatingUser}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  না, রাখুন
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUnapprove}
                  disabled={isUpdatingUser}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
                >
                  {isUpdatingUser ? (
                    <span>বাতিল করা হচ্ছে...</span>
                  ) : (
                    <span>হ্যাঁ, অনুমোদন বাতিল করুন</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStaff;
