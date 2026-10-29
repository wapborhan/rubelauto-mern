import { useState } from "react";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
} from "./exportHelper";

const ExportButtons = ({
  data,
  state,
  product,
  fileName = "export-data",
  title = "Report",
  columns = null,
}) => {
  // Support data, state, or product prop
  const exportData = data || state || product || [];
  const [isExporting, setIsExporting] = useState(false);

  const handleCSV = () => {
    try {
      exportToCSV(exportData, fileName);
    } catch (err) {
      console.error("CSV export error:", err);
    }
  };

  const handleExcel = async () => {
    try {
      setIsExporting(true);
      await exportToExcel(exportData, fileName);
    } catch (err) {
      console.error("Excel export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePDF = async () => {
    try {
      setIsExporting(true);
      await exportToPDF(exportData, fileName, title, columns);
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const isDisabled = isExporting || !exportData || exportData.length === 0;

  return (
    <div className="inline-flex items-center gap-1.5 p-1 bg-gray-50 border border-gray-200 rounded-lg">
      {/* CSV Button */}
      <button
        type="button"
        onClick={handleCSV}
        disabled={isDisabled}
        title="CSV ফাইল ডাউনলোড করুন"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 border border-gray-300 rounded-md shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        <i className="pi pi-file text-xs text-slate-500"></i>
        <span>CSV</span>
      </button>

      {/* Excel (XLS) Button */}
      <button
        type="button"
        onClick={handleExcel}
        disabled={isDisabled}
        title="Excel (.xlsx) ফাইল ডাউনলোড করুন"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-emerald-300 rounded-md shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        <i className="pi pi-file-excel text-xs text-emerald-600"></i>
        <span>XLS</span>
      </button>

      {/* PDF Button */}
      <button
        type="button"
        onClick={handlePDF}
        disabled={isDisabled}
        title="PDF ডকুমেন্ট ডাউনলোড করুন"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 hover:text-rose-800 border border-rose-300 rounded-md shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        <i className="pi pi-file-pdf text-xs text-rose-600"></i>
        <span>PDF</span>
      </button>
    </div>
  );
};

export default ExportButtons;
