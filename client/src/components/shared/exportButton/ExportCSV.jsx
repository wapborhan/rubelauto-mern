import { exportToCSV } from "./exportHelper";

const ExportCSV = ({ data, customers, state, product, fileName = "export-data" }) => {
  const exportData = data || customers || state || product || [];

  const handleExport = () => {
    exportToCSV(exportData, fileName);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={!exportData || exportData.length === 0}
      title="CSV ফাইল ডাউনলোড করুন"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 border border-gray-300 rounded-md shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
    >
      <i className="pi pi-file text-xs text-slate-500"></i>
      <span>CSV</span>
    </button>
  );
};

export default ExportCSV;
