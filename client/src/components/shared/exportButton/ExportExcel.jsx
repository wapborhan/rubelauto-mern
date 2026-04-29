import { Button } from "primereact/button";

const ExportExcel = ({ product }) => {
  const exportExcel = async () => {
    const xlsx = await import("xlsx");

    // যদি product single object হয় তাহলে array বানানো হবে
    const data = Array.isArray(product) ? product : [product];

    // Nested object flatten করার function
    const flattenObject = (obj, prefix = "") => {
      let result = {};

      for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          !(value instanceof Date)
        ) {
          Object.assign(result, flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
          result[newKey] = value.length > 0 ? JSON.stringify(value) : "[]";
        } else {
          result[newKey] = value ?? "";
        }
      }

      return result;
    };

    const formattedData = data.map((item) => flattenObject(item));

    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    const workbook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAsExcelFile(excelBuffer, "customer-data");
  };

  const saveAsExcelFile = async (buffer, fileName) => {
    const module = await import("file-saver");

    if (module && module.default) {
      const EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const EXCEL_EXTENSION = ".xlsx";

      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      });

      module.default.saveAs(
        data,
        `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`,
      );
    }
  };

  return (
    <Button
      type="button"
      icon="pi pi-file-excel"
      rounded
      label="XLS"
      onClick={exportExcel}
      data-pr-tooltip="XLS"
      className="p-badge-danger border-2 !bg-[#198754] px-4 py-2 text-white"
    />
  );
};

export default ExportExcel;
