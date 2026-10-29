import React from "react";

const TableHeader = ({
  title,
  subtitle,
  searchTerm = "",
  setSearchTerm,
  searchPlaceholder = "অনুসন্ধান করুন...",
  filters = null,
  actions = null,
  totalCount = 0,
  filteredCount = 0,
  onReset = null,
  hasActiveFilters = false,
}) => {
  return (
    <div className="bg-white p-5 rounded-t-xl border border-gray-200 border-b-0 space-y-4">
      {/* Top row: Title (if any) & Actions */}
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {title && (
            <div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
          )}
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Main Bar: Search, Filters & Reset */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        {/* Search Input */}
        {setSearchTerm && (
          <div className="relative flex-1 max-w-md">
            <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-8 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                title="মুছুন"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Custom Filters & Reset */}
        <div className="flex flex-wrap items-center gap-3">
          {filters}

          {hasActiveFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
              title="ফিল্টার রিসেট করুন"
            >
              <i className="pi pi-filter-slash text-xs"></i>
              রিসেট
            </button>
          )}

          {/* Counts */}
          <div className="flex items-center gap-2 font-medium text-xs text-gray-600 ml-auto">
            <span>
              মোট: <b className="text-gray-900">{totalCount}</b>
            </span>
            {hasActiveFilters && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-200">
                ফিল্টারকৃত: {filteredCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;

