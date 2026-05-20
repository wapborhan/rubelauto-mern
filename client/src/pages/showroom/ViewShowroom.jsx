import { useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import GlobalFilter from "../../components/shared/GlobalFilter";
import ExportButtons from "../../components/shared/exportButton/ExportButtons";
import { NavLink } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import { DataTable } from "primereact/datatable";
import { Column } from "jspdf-autotable";
import { useGetShowroomQuery } from "../../redux/feature/api/showroomApi";

const ViewShowroom = () => {
  const dt = useRef(null);
  const tooltipRef = useRef(null);
  const { data: allShowroom, isLoading } = useGetShowroomQuery();

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const renderHeader = () => {
    return (
      <div className="flex lg:flex-nowrap flex-wrap gap-5 lg:justify-between justify-center">
        <GlobalFilter setFilters={setFilters} filters={filters} />
        <div className="flex align-items-center  justify-between gap-2">
          <ExportButtons state={allShowroom} dt={dt} />
        </div>
      </div>
    );
  };

  const percentDueTemplate = ({ cashDue, percentDue }) => {
    return <span>{cashDue + percentDue}</span>;
  };

  const tabID = (data, props) => {
    return props.rowIndex + 1;
  };

  const verifiedBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-4">
        {/* <NavLink
          to={`/contact/supplier/view/${rowData?._id}`}
          className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline custom-tooltip cursor-pointer"
          data-pr-tooltip="View"
          data-pr-position="top"
        >
          <i className="pi pi-eye"></i>
        </NavLink>
        <NavLink
          to={`/contact/supplier/edit/${rowData?._id}`}
          className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline custom-tooltip cursor-pointer"
          data-pr-tooltip="Edit"
          data-pr-position="top"
        >
          <i className="pi pi-file-edit"></i>
        </NavLink> */}
      </div>
    );
  };

  const header = renderHeader();

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
        value={allShowroom}
        header={header}
        loading={isLoading}
        filters={filters}
        globalFilterFields={["name"]}
        // paginator
        rows={15}
        // rowsPerPageOptions={[15, 25, 50, 100]}
        emptyMessage="No Supplier found."
      >
        <Column
          body={tabID}
          header="SL"
          showFilterMenu={false}
          filterPlaceholder="Search"
          // style={{ minWidth: "8rem" }}
        />
        <Column
          field="name"
          header="Showroom Name"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="code"
          header="Code"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="address"
          header="Address"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "15rem" }}
        />
        <Column
          field="cashDue"
          header="Cash Due"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="percentDue"
          header="Percent Due"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="openingBalance"
          header="Total"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
          body={percentDueTemplate}
        />
        <Column
          field="remainingBalance"
          header="Remaining Balance"
          showFilterMenu={false}
          filterPlaceholder="Search"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="verified"
          header="Action"
          dataType="boolean"
          style={{ minWidth: "2rem" }}
          body={verifiedBodyTemplate}
        />
      </DataTable>
    </div>
  );
};

export default ViewShowroom;
