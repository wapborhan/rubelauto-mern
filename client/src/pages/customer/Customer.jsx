import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCustomerQuery } from "../../redux/feature/api/customerApi";
import {
  saleDateTemplate,
  verifiedBodyTemplate,
  accountTemplate,
  installmentTemplate,
  insTermTemplate,
  tabID,
  rowClass,
} from "./customerTableTemplates";
import { renderHeader, footerGroup } from "./customerTableHeaderFooter";

export default function Customer() {
  const tooltipRef = useRef(null);
  const dt = useRef(null);
  const { status } = useParams();
  const path = status || "running";

  const { showRoom } = useSelector((state) => state.userStore);
  const {
    data: customers,
    refetch,
    isLoading,
  } = useGetCustomerQuery({ path, showRoom });

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [instFromDay, setInstFromDay] = useState(null);
  const [instToDay, setInstToDay] = useState(null);
  const [showRoomFilter, setShowRoomFilter] = useState(null);

  useEffect(() => {
    refetch();
    tooltipRef.current && tooltipRef.current.updateTargetEvents();
  }, [path, refetch, customers]);

  const uniqueShowRooms = [
    ...new Set(customers?.data?.map((c) => c.showRoom)),
  ].filter(Boolean);

  const filteredData = customers?.data?.filter((item) => {
    const saleDate = new Date(item.saledate);
    const installmentDate = new Date(item?.accountInfo?.insdate);

    // Sale Date Range
    if (fromDate && saleDate < new Date(fromDate)) return false;
    if (toDate && saleDate > new Date(toDate)) return false;

    // Installment Day Number Filter (1–31)
    if (instFromDay || instToDay) {
      const day = installmentDate.getDate();
      const from = instFromDay || 1;
      const to = instToDay || 31;
      if (day < from || day > to) return false;
    }
    if (showRoomFilter && item.showRoom !== showRoomFilter) return false;
    return true;
  });

  const header = renderHeader(
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
    uniqueShowRooms
  );
  const footer = footerGroup(filteredData, path);

  return (
    <div className="card w-full mx-auto ">
      <Tooltip ref={tooltipRef} target=".custom-tooltip" className="text-sm" />
      <DataTable
        ref={dt}
        dataKey="_id"
        value={filteredData}
        header={header}
        footerColumnGroup={footer}
        loading={isLoading}
        filters={filters}
        globalFilterFields={["customerInfo.name", "cardno"]}
        stripedRows
        paginator
        rows={10}
        // rowClassName={rowClass}
        // rowsPerPageOptions={[10, 25, 50, 100]}
        emptyMessage="কোনো কাস্টমার তথ্য নেই"
      >
        <Column body={tabID} header="ক্রঃ" />
        <Column
          header="বিক্রি তারিখ"
          style={{ minWidth: "8.5rem" }}
          body={(rowData) => saleDateTemplate(rowData)}
        />

        <Column
          field="cardno"
          header="কার্ড নং"
          style={{ minWidth: "7.5rem" }}
        />
        <Column
          field="customerInfo.name"
          header="নাম"
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="customerInfo.number"
          header="মোবাইল"
          // style={{ minWidth: "8rem" }}
        />
        <Column
          field="productInfo.models"
          header="মডেল"
          style={{ minWidth: "12rem" }}
        />
        {/* <Column
          header="চুক্তি মাস"
          style={{ minWidth: "2rem" }}
          field="accountInfo.term"
        /> */}
        <Column
          header="চুক্তির বকেয়া"
          body={(rowData) => accountTemplate(rowData)}
          style={{ minWidth: "5rem" }}
        />
        <Column
          header="মাস"
          body={(rowData) => insTermTemplate(rowData)}
          style={{ minWidth: "5rem" }}
        />
        <Column
          header="কিস্তি বকেয়া"
          body={(rowData) => installmentTemplate(rowData)}
          style={{ minWidth: "5rem" }}
        />
        <Column field="showRoom" header="শোরুম" />
        <Column
          header="মেনু"
          body={(rowData) => verifiedBodyTemplate(rowData, path)}
        />
      </DataTable>
    </div>
  );
}
