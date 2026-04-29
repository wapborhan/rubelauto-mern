import ExportExcel from "../../components/shared/exportButton/ExportExcel";
import GlobalFilter from "../../components/shared/GlobalFilter";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "jspdf-autotable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Dropdown } from "primereact/dropdown";

// Header
export const renderHeader = (
  filters,
  setFilters,
  customers,
  dt,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  instFromDay,
  setInstFromDay,
  instToDay,
  setInstToDay,
  showRoomFilter,
  setShowRoomFilter,
  uniqueShowRooms,
) => {
  return (
    <div className="grid lg:grid-cols-12 grid-cols-1 justify-between">
      <div className="col-span-6">
        <GlobalFilter setFilters={setFilters} filters={filters} />
      </div>
      <div className="col-span-4">
        <Dropdown
          value={showRoomFilter}
          options={uniqueShowRooms.map((sr) => ({ label: sr, value: sr }))}
          placeholder="Select Showroom"
          onChange={(e) => setShowRoomFilter(e.value)}
          showClear
          className="w-52"
        />
      </div>

      <div className="col-span-2 flex align-items-center  justify-between gap-2">
        <ExportExcel product={customers?.data} />
      </div>
      {/* Day Number Filter */}
      <div className="col-span-4 flex items-center gap-2">
        <label>Installment Day:</label>

        <select
          value={instFromDay || ""}
          onChange={(e) => setInstFromDay(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value="">From</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <select
          value={instToDay || ""}
          onChange={(e) => setInstToDay(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value="">To</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        {(instFromDay || instToDay) && (
          <button
            onClick={() => {
              setInstFromDay(null);
              setInstToDay(null);
            }}
            className="p-button p-button-sm p-button-text"
          >
            ❌
          </button>
        )}
      </div>

      {/* Date Range Filter */}
      <div className=" col-span-6 flex items-center gap-2">
        <label className="text-nowrap"> Sale Date:</label>
        <Calendar
          value={fromDate}
          onChange={(e) => setFromDate(e.value)}
          dateFormat="dd-mm-yy"
          showIcon
          placeholder="From date"
          className="w-7/12"
        />
        <Calendar
          value={toDate}
          onChange={(e) => setToDate(e.value)}
          dateFormat="dd-mm-yy"
          showIcon
          placeholder="To date"
          className="w-7/12"
        />{" "}
        {(fromDate || toDate) && (
          <button
            onClick={() => {
              setFromDate(null);
              setToDate(null);
            }}
            className="p-button p-button-sm p-button-text"
          >
            ❌
          </button>
        )}
      </div>
    </div>
  );
};

// Footer ColumnGroup
export const footerGroup = (customers) => (
  <ColumnGroup>
    <Row>
      <Column footer={() => customerTotal(customers)} />
      <Column
        footer="Totals Due :"
        colSpan={5}
        footerStyle={{ textAlign: "right" }}
      />
      <Column footer={() => contractTotal(customers)} />
      <Column footer={() => thisYearTotal(customers)} />
    </Row>
  </ColumnGroup>
);

// Total Customers
export const customerTotal = (customers) => {
  return customers ? customers?.length : 0;
};

// Contract Total Due
export const contractTotal = (customers) => {
  let total = 0;
  if (customers) {
    for (let sale of customers) {
      const totalPrice =
        sale?.accountInfo?.saleprice + sale?.accountInfo?.hireprice;
      const totalDue =
        totalPrice -
        sale?.accountInfo?.dpamount -
        sale?.accountInfo?.totalInstallmentAmount;

      total += totalDue;
    }
  }
  return total;
};

// This Year Installment Total Due
export const thisYearTotal = (customers) => {
  let total = 0;
  if (customers) {
    for (let sale of customers) {
      const saleDate = new Date(sale?.saledate);
      const currentDate = new Date();

      let monthDifference =
        (currentDate.getFullYear() - saleDate.getFullYear()) * 12;
      monthDifference -= saleDate.getMonth();
      monthDifference += currentDate.getMonth();

      if (currentDate.getDate() < saleDate.getDate()) {
        monthDifference--;
      }

      const daysDifference = Math.floor(
        (currentDate - saleDate) / (1000 * 60 * 60 * 24),
      );
      if (daysDifference > 30) {
        monthDifference++;
      }

      const needPaidAmount = monthDifference * sale?.accountInfo?.insamount;
      const installmentDue =
        needPaidAmount - sale?.accountInfo?.totalInstallmentAmount;

      total += installmentDue;
    }
  }
  return total;
};
