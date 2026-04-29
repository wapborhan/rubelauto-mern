import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Tag } from "primereact/tag";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import GlobalFilter from "../../components/shared/GlobalFilter";
import { useGetSupplierQuery } from "../../redux/feature/api/supplierApi";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

function ViewSuplier() {
  const { pathname } = useLocation();
  const dt = useRef(null);
  const tooltipRef = useRef(null);
  const { data: supplier, isLoading, refetch } = useGetSupplierQuery();
  const [allSuplier, setAllSupplier] = useState([]);
  const { showRoom } = useSelector((state) => state.userStore);

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = (
    <Button
      type="button"
      icon="pi pi-download"
      text
      onClick={() => dt.current.exportCSV({ selectionOnly: false })}
    />
  );

  useEffect(() => {
    if (pathname === "/contact/supplier/parts/view") {
      const filterSupplier = supplier?.data?.filter(
        (item) => item.prodType === "Parts"
      );
      setAllSupplier(filterSupplier);
    } else {
      setAllSupplier(supplier?.data);
    }
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, supplier]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const renderHeader = () => {
    return (
      <div className="flex lg:flex-nowrap flex-wrap gap-5 lg:justify-between justify-center">
        <GlobalFilter setFilters={setFilters} filters={filters} />
        <NavLink
          to={`/contact/supplier/add`}
          className="px-6 py-3 bg-primary text-white rounded-md cursor-pointer"
        >
          <i className="pi pi-plus"></i>{" "}
          <span className="ms-2">সাপ্লায়ার যুক্ত করুণ</span>
        </NavLink>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.prodType} severity={getSeverity(rowData)} />;
  };
  const getSeverity = (rowData) => {
    switch (rowData.prodType) {
      case "Motorcycle":
        return "success";

      case "Parts":
        return "danger";

      case "Easybike":
        return "warning";

      case "LPG":
        return "info";

      default:
        return null;
    }
  };

  const verifiedBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <NavLink
          to={`/contact/supplier/view/${rowData?._id}`}
          className="text-white focus:outline-none focus:underline custom-tooltip cursor-pointer py-1 px-2 bg-primary rounded-md"
          data-pr-tooltip="View"
          data-pr-position="top"
        >
          <i className="pi pi-eye text-[13px]"></i>
        </NavLink>
        <NavLink
          to={`/contact/supplier/payment/${rowData?._id}`}
          className="text-white focus:outline-none focus:underline custom-tooltip cursor-pointer py-1 px-2 bg-primary rounded-md"
          data-pr-tooltip="Payment"
          data-pr-position="top"
        >
          <i className="pi pi-money-bill  text-[13px]"></i>
        </NavLink>
        {showRoom !== "Parts" && (
          <NavLink
            to={`/contact/supplier/edit/${rowData?._id}`}
            className="text-white focus:outline-none focus:underline custom-tooltip cursor-pointer py-1 px-2 bg-primary rounded-md"
            data-pr-tooltip="Edit"
            data-pr-position="top"
          >
            <i className="pi pi-file-edit  text-[13px]"></i>
          </NavLink>
        )}
      </div>
    );
  };

  const header = renderHeader();
  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer={allSuplier?.length} />
        <Column
          footer="Totals:"
          colSpan={4}
          footerStyle={{ textAlign: "right" }}
        />
        <Column footer={"0"} />
        <Column footer={"0"} />
        <Column footer={"0"} />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="card">
      <Tooltip
        ref={tooltipRef}
        target=".custom-tooltip"
        className="text-sm p-2"
      />
      <DataTable
        ref={dt}
        dataKey="_id"
        value={allSuplier}
        header={header}
        loading={isLoading}
        filters={filters}
        globalFilterFields={["bssName", "prodType"]}
        paginator
        rows={10}
        stripedRows
        // rowsPerPageOptions={[10, 25, 50, 100]}
        // paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        // currentPageReportTemplate="{first} to {last} of {totalRecords}"
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        // scrollable
        // scrollHeight="480px"
        footerColumnGroup={footerGroup}
        emptyMessage="No Suplier found."
      >
        <Column
          body={(data, props) => props.rowIndex + 1}
          header="ক্রঃ"
          showFilterMenu={false}
          filterPlaceholder="Search"
          // style={{ minWidth: "8rem" }}
        />
        {pathname === "/contact/supplier/parts/view" ? null : (
          <Column
            field="status"
            header="স্ট্যাটাস"
            showFilterMenu={false}
            filterPlaceholder="Search"
            body={statusBodyTemplate}
            // style={{ minWidth: "8rem" }}
            className="capitalize"
          />
        )}
        <Column
          field="bssName"
          header="সরবরাহকারী"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="empName"
          header="কর্মচারী"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="mobile"
          header="নম্বর"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="openingBalance"
          header="ওপেনিং ব্যালান্স"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="totalPurchase"
          header="ক্রয়"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="totalPayment"
          header="পেমেন্ট"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="currentBalance"
          header="বাকি"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="verified"
          header="মেনু"
          dataType="boolean"
          // style={{ minWidth: "1rem" }}
          body={verifiedBodyTemplate}
        />
      </DataTable>
    </div>
  );
}

export default ViewSuplier;
