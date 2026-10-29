import { useState } from "react";
import { exportToPDF } from "./exportHelper";

const ExportPDF = ({
  data,
  product,
  state,
  customers,
  fileName = "export-data",
  title = "Report",
  columns = null,
}) => {
  const exportData = data || product || state || customers || [];
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      await exportToPDF(exportData, fileName, title, columns);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading || !exportData || exportData.length === 0}
      title="PDF ডকুমেন্ট ডাউনলোড করুন"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 hover:text-rose-800 border border-rose-300 rounded-md shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
    >
      <i className={`pi ${loading ? "pi-spin pi-spinner" : "pi-file-pdf"} text-xs text-rose-600`}></i>
      <span>PDF</span>
    </button>
  );
};

export default ExportPDF;
