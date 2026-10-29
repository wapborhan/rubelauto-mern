import ExportButtons from "../../components/shared/exportButton/ExportButtons";

const CustomerTableHeader = ({
  searchTerm,
  setSearchTerm,
  showRoomFilter,
  setShowRoomFilter,
  uniqueShowRooms = [],
  instFromDay,
  setInstFromDay,
  instToDay,
  setInstToDay,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onResetFilters,
  hasActiveFilters,
  filteredData = [],
  totalCount = 0,
}) => {
  return (
    <div className="bg-white p-5 rounded-t-xl border border-gray-200 border-b-0 space-y-4">
      {/* Top Bar: Search & Showroom Filter & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="নাম, কার্ড নং বা মোবাইল দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-8 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters & Export */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Showroom Filter */}
          <select
            value={showRoomFilter || ""}
            onChange={(e) => setShowRoomFilter(e.target.value || null)}
            className="px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          >
            <option value="">সকল শোরুম (All Showrooms)</option>
            {uniqueShowRooms.map((sr) => (
              <option key={sr} value={sr}>
                {sr}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
              title="ফিল্টার রিসেট করুন"
            >
              <i className="pi pi-filter-slash text-xs"></i>
              রিসেট
            </button>
          )}

          {/* Export to CSV, XLS, PDF */}
          <ExportButtons
            data={filteredData}
            fileName="customers"
            title="Customer Accounts"
          />
        </div>
      </div>

      {/* Secondary Bar: Date & Day Filters & Count Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Installment Day Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-600">কিস্তির তারিখ:</span>
            <select
              value={instFromDay || ""}
              onChange={(e) =>
                setInstFromDay(e.target.value ? Number(e.target.value) : null)
              }
              className="bg-white border border-gray-300 px-1.5 py-1 rounded text-xs outline-none"
            >
              <option value="">দিন হতে</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="text-gray-400">-</span>
            <select
              value={instToDay || ""}
              onChange={(e) =>
                setInstToDay(e.target.value ? Number(e.target.value) : null)
              }
              className="bg-white border border-gray-300 px-1.5 py-1 rounded text-xs outline-none"
            >
              <option value="">দিন পর্যন্ত</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Sale Date Range */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-600">বিক্রয় তারিখ:</span>
            <input
              type="date"
              value={fromDate || ""}
              onChange={(e) => setFromDate(e.target.value || null)}
              className="bg-white border border-gray-300 px-1.5 py-1 rounded text-xs outline-none"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={toDate || ""}
              onChange={(e) => setToDate(e.target.value || null)}
              className="bg-white border border-gray-300 px-1.5 py-1 rounded text-xs outline-none"
            />
          </div>
        </div>

        {/* Count Badge */}
        <div className="flex items-center gap-2 font-medium text-gray-600">
          <span>
            মোট এন্ট্রি: <b className="text-gray-900">{totalCount}</b>
          </span>
          {hasActiveFilters && (
            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold border border-blue-200">
              ফিল্টারকৃত: {filteredData.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerTableHeader;
