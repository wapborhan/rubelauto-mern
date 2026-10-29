import { useState } from "react";
import { exportToExcel } from "./exportHelper";

const ExportExcel = ({ data, product, state, customers, fileName = "export-data" }) => {
  const exportData = data || product || state || customers || [];
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      await exportToExcel(exportData, fileName);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading || !exportData || exportData.length === 0}
      title="Excel (.xlsx) ফাইল ডাউনলোড করুন"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-emerald-300 rounded-md shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
    >
      <i className={`pi ${loading ? "pi-spin pi-spinner" : "pi-file-excel"} text-xs text-emerald-600`}></i>
      <span>XLS</span>
    </button>
  );
};

export default ExportExcel;
