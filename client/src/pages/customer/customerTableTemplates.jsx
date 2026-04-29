import moment from "moment";
import { NavLink } from "react-router-dom";
import SeizedBack from "./seized/SeizedBack";

export const saleDateTemplate = (rowData) => {
  return <span>{moment(rowData.saledate).format("DD-MMM-YYYY")}</span>;
};

export const verifiedBodyTemplate = (rowData, path) => {
  console.log(path);

  return (
    <div className="flex gap-1 justify-center">
      {path === "cash" ? (
        ""
      ) : (
        <NavLink
          to={`/customer/view/${rowData?.cardno}`}
          className="text-white focus:outline-none focus:underline custom-tooltip cursor-pointer  py-1 px-2 bg-primary rounded-md"
          data-pr-tooltip="Details"
          data-pr-position="top"
        >
          <i className="pi pi-eye"></i>
        </NavLink>
      )}
      {path === "running" ? (
        <>
          <NavLink
            to={`/customer/payment/${rowData?.cardno}`}
            className="text-white focus:outline-none focus:underline custom-tooltip cursor-pointer  py-1 px-2 bg-primary rounded-md"
            data-pr-tooltip="Payment"
            data-pr-position="top"
          >
            <i className="pi pi-money-bill"></i>
          </NavLink>
          <NavLink
            to={`/customer/seized/${rowData?.cardno}`}
            className="text-white focus:outline-none focus:underline custom-tooltip cursor-pointer  py-1 px-2 bg-primary rounded-md"
            data-pr-tooltip="Seized"
            data-pr-position="top"
          >
            <i className="pi pi-lock"></i>
          </NavLink>
        </>
      ) : (
        ""
      )}

      {(path === "cash" || path === "running") && (
        <NavLink
          to={`/customer/paid/${rowData?.cardno}`}
          className="text-white focus:outline-none focus:underline custom-tooltip cursor-pointer  py-1 px-2 bg-primary rounded-md"
          data-pr-tooltip="Paid"
          data-pr-position="top"
        >
          <i className="pi pi-times-circle"></i>
        </NavLink>
      )}
      {path === "seized" && <SeizedBack data={rowData} />}
    </div>
  );
};

export const accountTemplate = (rowData) => {
  const totalPrice =
    rowData?.accountInfo?.saleprice + rowData?.accountInfo?.hireprice;
  const totalDue =
    totalPrice -
    rowData?.accountInfo?.dpamount -
    rowData?.accountInfo?.totalInstallmentAmount;

  return <div className="flex gap-3 justify-center">{totalDue}</div>;
};

export const installmentTemplate = (rowData) => {
  const saleDate = new Date(rowData?.saledate);
  const currentDate = new Date();

  let monthDifference =
    (currentDate.getFullYear() - saleDate.getFullYear()) * 12;
  monthDifference -= saleDate.getMonth();
  monthDifference += currentDate.getMonth();

  if (currentDate.getDate() < saleDate.getDate()) {
    monthDifference--;
  }

  const daysDifference = Math.floor(
    (currentDate - saleDate) / (1000 * 60 * 60 * 24)
  );
  if (daysDifference > 30) {
    monthDifference++;
  }

  const insAmount = rowData?.accountInfo?.insamount || 0;
  const totalInstallmentPaid =
    rowData?.accountInfo?.totalInstallmentAmount || 0;
  const dpAmount = rowData?.accountInfo?.dpamount || 0;
  const salePrice = rowData?.accountInfo?.saleprice || 0;
  const hirePrice = rowData?.accountInfo?.hireprice || 0;

  const totalPrice = salePrice + hirePrice;
  const totalDue = totalPrice - dpAmount - totalInstallmentPaid;

  const needPaidAmount = monthDifference * insAmount;
  const installmentDue = needPaidAmount - totalInstallmentPaid;

  // Compare and take the lower value
  const payableAmount = Math.min(totalDue, installmentDue);

  return <div className="flex gap-3 justify-center">{payableAmount}</div>;
};

export const insTermTemplate = (rowData) => {
  const term = rowData?.accountInfo?.term || 0;
  const saleDate = new Date(rowData?.saledate);
  const currentDate = new Date();

  let monthDifference =
    (currentDate.getFullYear() - saleDate.getFullYear()) * 12;
  monthDifference -= saleDate.getMonth();
  monthDifference += currentDate.getMonth();

  if (currentDate.getDate() < saleDate.getDate()) {
    monthDifference--;
  }

  const daysDifference = Math.floor(
    (currentDate - saleDate) / (1000 * 60 * 60 * 24)
  );

  if (daysDifference > 30) {
    monthDifference++;
  }

  // Conditional styling
  const style =
    monthDifference >= term
      ? "bg-red-500 text-white text-black px-1 py-1 rounded"
      : "";

  return (
    <div className={`flex gap-3 justify-center w-full ${style}`}>
    {/* <div className={`flex gap-3 justify-center w-full `}> */}
      {monthDifference}</div>
  );
};

export const rowClass = (data) => {
  const term = data?.accountInfo?.term || 0;
  const saleDate = new Date(data?.saledate);
  const currentDate = new Date();

  let monthDifference =
    (currentDate.getFullYear() - saleDate.getFullYear()) * 12;
  monthDifference -= saleDate.getMonth();
  monthDifference += currentDate.getMonth();

  if (currentDate.getDate() < saleDate.getDate()) {
    monthDifference--;
  }

  const daysDifference = Math.floor(
    (currentDate - saleDate) / (1000 * 60 * 60 * 24)
  );

  if (daysDifference > 30) {
    monthDifference++;
  }
  const style =
    monthDifference >= term
      ? "!bg-red-700 text-white text-black px-1 py-1 rounded"
      : "";
  return style;
};

export const tabID = (data, props) => {
  return props.rowIndex + 1;
};
