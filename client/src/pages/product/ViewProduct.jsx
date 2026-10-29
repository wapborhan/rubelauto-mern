import { useEffect, useRef, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  useGetproductQuery,
  useSetDeleteProductMutation,
} from "../../redux/feature/api/productApi";
import TableHeader from "../../components/shared/table/TableHeader";
import TablePagination from "../../components/shared/table/TablePagination";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";

export default function ViewProduct() {
  const toast = useRef(null);
  const { data: product, isLoading, refetch } = useGetproductQuery();
  const [deleteProduct, { isSuccess, isError }] =
    useSetDeleteProductMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const rawList = product?.data || [];

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const brand = (item.brandName || "").toLowerCase();
        const model = (item.modelName || "").toLowerCase();
        const cash = String(item.cashPrice || "");
        const credit = String(item.creditPrice || "");

        if (
          !brand.includes(q) &&
          !model.includes(q) &&
          !cash.includes(q) &&
          !credit.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rawList, searchTerm]);

  const hasActiveFilters = Boolean(searchTerm);

  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    confirmDialog({
      message: "আপনি কি নিশ্চিতভাবে এই পণ্যটি মুছে ফেলতে চান?",
      header: "পণ্য ডিলিট নিশ্চিতকরণ",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "হ্যাঁ, মুছুন",
      rejectLabel: "বাতিল",
      acceptClassName: "p-button-danger",
      accept: () => deleteProduct(id),
      reject: () =>
        toast.current?.show({
          severity: "warn",
          summary: "বাতিল",
          detail: "ডিলিট করার প্রক্রিয়া বাতিল করা হয়েছে।",
          life: 2500,
        }),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.current?.show({
        severity: "success",
        summary: "সফল",
        detail: "পণ্যটি সফলভাবে মুছে ফেলা হয়েছে।",
        life: 3000,
      });
    }
  }, [isSuccess, refetch]);

  useEffect(() => {
    if (isError) {
      toast.current?.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: "পণ্যটি ডিলিট করতে সমস্যা হয়েছে।",
        life: 3000,
      });
    }
  }, [isError]);

  // Pagination
  const totalItems = filteredData.length;
  const paginatedData = useMemo(() => {
    if (pageSize === "all") return filteredData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="w-full mx-auto p-4 md:p-6 space-y-0">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Header */}
      <TableHeader
        title="পণ্যের মডেল তালিকা (Products)"
        subtitle="শোরুমের সকল মডেল ও মূল্য ব্যবস্থাপনা"
        searchTerm={searchTerm}
        setSearchTerm={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="ব্র্যান্ড, মডেল বা মূল্য দিয়ে খুঁজুন..."
        totalCount={rawList.length}
        filteredCount={filteredData.length}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        actions={
          <div className="flex items-center gap-2">
            <NavLink
              to="/products/add"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <i className="pi pi-plus text-xs"></i>
              নতুন মডেল যুক্ত করুন
            </NavLink>
            <ExportButtons
              data={filteredData}
              fileName="products"
              title="Product Models"
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
              পণ্যের ডাটা লোড হচ্ছে...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">ক্রঃ</th>
                  <th className="py-3 px-3.5">ছবি</th>
                  <th className="py-3 px-3.5">সাপ্লায়ার / ব্র্যান্ড</th>
                  <th className="py-3 px-3.5">মডেল নাম</th>
                  <th className="py-3 px-3.5 text-right">নগদ মূল্য (Cash)</th>
                  <th className="py-3 px-3.5 text-right">কিস্তি মূল্য (Credit)</th>
                  <th className="py-3 px-3.5 text-center w-28">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      <i className="pi pi-inbox text-3xl mb-2 block"></i>
                      কোনো পণ্যের তথ্য পাওয়া যায়নি
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
                          {row.modelImg ? (
                            <img
                              src={row.modelImg}
                              alt={row.modelName}
                              className="w-12 h-10 object-contain rounded border border-gray-200 bg-white p-0.5"
                            />
                          ) : (
                            <div className="w-12 h-10 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
                              No pic
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3.5 font-medium text-gray-800 whitespace-nowrap">
                          {row.brandName || "—"}
                        </td>
                        <td className="py-3 px-3.5 font-bold text-gray-900 whitespace-nowrap">
                          {row.modelName || "—"}
                        </td>
                        <td className="py-3 px-3.5 text-right font-semibold text-emerald-600 whitespace-nowrap">
                          ৳ {Number(row.cashPrice || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-3.5 text-right font-semibold text-blue-600 whitespace-nowrap">
                          ৳ {Number(row.creditPrice || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <NavLink
                              to={`/products/edit/${row._id}`}
                              className="p-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded border border-indigo-200 transition-colors"
                              title="সম্পাদনা করুন"
                            >
                              <i className="pi pi-pencil text-xs"></i>
                            </NavLink>
                            <button
                              type="button"
                              onClick={() => handleDelete(row._id)}
                              className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded border border-red-200 transition-colors"
                              title="মুছে ফেলুন"
                            >
                              <i className="pi pi-trash text-xs"></i>
                            </button>
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
