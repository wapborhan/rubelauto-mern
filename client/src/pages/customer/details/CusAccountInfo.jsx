import moment from "moment";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect } from "react";
import { useGetSingleInstallmentQuery } from "../../../redux/feature/api/customerApi";

const CusAccountInfo = ({ singleCustomer }) => {
  const {
    data: singleInstallment,
    refetch,
    isLoading,
  } = useGetSingleInstallmentQuery(singleCustomer?.cardno);

  const hireDue =
    (singleCustomer?.accountInfo?.hireprice || 0) +
    (singleCustomer?.accountInfo?.saleprice || 0) -
    (singleCustomer?.accountInfo?.dpamount || 0);

  useEffect(() => {
    refetch();
  }, [hireDue, refetch]);

  const calculateRemainingDue = (rowIndex) => {
    // Reduce the amounts of all prior rows
    const previousAmounts = singleInstallment?.data
      ?.slice(0, rowIndex + 1) // Include current row
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    return hireDue - previousAmounts;
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <DataTable
      value={singleInstallment?.data}
      tableStyle={{ minWidth: "50rem" }}
      className="p-datatable p-component p-datatable-responsive-scroll  mt-4"
      emptyMessage="No installment found."
      rowHover
    >
      <Column header="SL" body={(data, props) => props.rowIndex + 1} />
      <Column
        header="Date"
        body={(ins) => moment(ins?.date).format("D-MM-YY")}
      />
      <Column header="Amount" field="amount" />
      <Column
        header="Remaining Due"
        body={(ins, props) => calculateRemainingDue(props.rowIndex)}
      />

      <Column header="Received By" field="receiver" />
      <Column header="Voucher No." field="voucher" />

      <Column header="Notes" field="coments" />
    </DataTable>
  );
};

export default CusAccountInfo;
