import React from "react";

const TablePagination = ({
  totalItems = 0,
  pageSize = 10,
  setPageSize,
  currentPage = 1,
  setCurrentPage,
  pageSizeOptions = [10, 25, 50, 100, "all"],
}) => {
  if (totalItems <= 0) return null;

  const totalPages =
    pageSize === "all" ? 1 : Math.ceil(totalItems / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages) || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startRecord =
    pageSize === "all" ? 1 : (activePage - 1) * pageSize + 1;
  const endRecord =
    pageSize === "all" ? totalItems : Math.min(activePage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 bg-gray-50/50 text-xs">
      {/* Page size selector & info */}
      <div className="flex items-center gap-2 text-gray-600">
        <span>প্রতি পৃষ্ঠায়:</span>
        <select
          value={pageSize}
          onChange={(e) => {
            const val =
              e.target.value === "all" ? "all" : Number(e.target.value);
            setPageSize(val);
            setCurrentPage(1);
          }}
          className="bg-white border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "all" ? "সবগুলো (All)" : opt}
            </option>
          ))}
        </select>
        <span className="text-gray-400">|</span>
        <span>
          মোট <b>{totalItems}</b> টির মধ্যে <b>{startRecord} - {endRecord}</b> দেখাচ্ছে
        </span>
      </div>

      {/* Pagination buttons */}
      {pageSize !== "all" && totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            আগের পৃষ্ঠা
          </button>

          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 7) return true;
                if (p === 1 || p === totalPages) return true;
                return Math.abs(p - activePage) <= 1;
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const hasGap = prev && p - prev > 1;

                return (
                  <span key={p} className="flex items-center">
                    {hasGap && <span className="px-1 text-gray-400">...</span>}
                    <button
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`w-7 h-7 text-xs font-semibold rounded transition-colors ${
                        activePage === p
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            পরের পৃষ্ঠা
          </button>
        </div>
      )}
    </div>
  );
};

export default TablePagination;

