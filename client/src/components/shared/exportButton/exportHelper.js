/**
 * Utility functions for exporting data to CSV, Excel (XLSX), and PDF
 */

export const flattenObject = (obj, prefix = "") => {
  let result = {};
  if (!obj || typeof obj !== "object") return result;

  for (const key of Object.keys(obj)) {
    // Skip internal fields
    if (key === "_id" || key === "__v" || key === "password") continue;

    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (
      value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      Object.assign(result, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      result[newKey] =
        value.length > 0
          ? value
              .map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v)))
              .join("; ")
          : "";
    } else if (value instanceof Date) {
      result[newKey] = value.toISOString().split("T")[0];
    } else {
      result[newKey] = value ?? "";
    }
  }

  return result;
};

export const exportToCSV = (rawData, fileName = "export-data") => {
  const data = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
  if (data.length === 0) {
    alert("এক্সপোর্ট করার মতো কোনো ডাটা নেই।");
    return;
  }

  const flattened = data.map((item) => flattenObject(item));

  // Collect all unique keys across all records
  const headers = Array.from(
    new Set(flattened.flatMap((item) => Object.keys(item)))
  );

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headerRow = headers.map(escapeCSV).join(",");
  const dataRows = flattened.map((row) =>
    headers.map((h) => escapeCSV(row[h] ?? "")).join(",")
  );

  const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToExcel = async (rawData, fileName = "export-data") => {
  const data = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
  if (data.length === 0) {
    alert("এক্সপোর্ট করার মতো কোনো ডাটা নেই।");
    return;
  }

  const xlsx = await import("xlsx");
  const { saveAs } = await import("file-saver");

  const flattened = data.map((item) => flattenObject(item));
  const worksheet = xlsx.utils.json_to_sheet(flattened);
  const workbook = {
    Sheets: { Data: worksheet },
    SheetNames: ["Data"],
  };

  const excelBuffer = xlsx.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportToPDF = async (
  rawData,
  fileName = "export-data",
  title = "Rubel Auto",
  customColumns = null
) => {
  const data = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
  if (data.length === 0) {
    alert("এক্সপোর্ট করার মতো কোনো ডাটা নেই।");
    return;
  }

  const { default: jsPDF } = await import("jspdf");
  await import("jspdf-autotable");

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const flattened = data.map((item) => flattenObject(item));

  // Determine columns
  let columns = [];
  if (customColumns && customColumns.length > 0) {
    columns = customColumns;
  } else {
    const allKeys = Array.from(
      new Set(flattened.flatMap((item) => Object.keys(item)))
    );
    // Take up to top 8-10 meaningful columns to fit landscape nicely
    columns = allKeys.slice(0, 8).map((k) => ({
      header: k.replace(/\./g, " ").toUpperCase(),
      dataKey: k,
    }));
  }

  // Header Title
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text("Rubel Auto - " + title, 40, 36);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Export Date: ${new Date().toLocaleDateString()} | Total Records: ${data.length}`,
    40,
    52
  );

  doc.autoTable({
    startY: 64,
    columns: columns.map((c) => ({
      header: c.header || c.title,
      dataKey: c.dataKey || c.field,
    })),
    body: flattened,
    theme: "striped",
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: 51,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { top: 60, left: 30, right: 30, bottom: 30 },
  });

  doc.save(`${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

