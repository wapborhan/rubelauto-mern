import { Row } from "jspdf-autotable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";

export const footerGroup = (allSuplier) => (
  <ColumnGroup>
    <Row>
      <Column footer={allSuplier?.length} />
      <Column footer="মোট:" colSpan={4} footerStyle={{ textAlign: "right" }} />
      <Column footer={() => purchaseTotal(allSuplier)} />
      <Column footer={() => paymentTotal(allSuplier)} />
      <Column footer={() => dueAmount(allSuplier)} />
    </Row>
  </ColumnGroup>
);

// Purchase Total Due
export const purchaseTotal = (allSuplier) => {
  let total = 0;

  if (allSuplier && allSuplier.length > 0) {
    allSuplier.forEach((item) => {
      total += item.totalPurchase;
    });
  }

  return total.toLocaleString("en-IN");
};

// Payment Total Due
export const paymentTotal = (allSuplier) => {
  let total = 0;
  if (allSuplier && allSuplier.length > 0) {
    allSuplier.forEach((item) => {
      total += item.totalPayment;
    });
  }
  return total.toLocaleString("en-IN");
};

// Due Amount
export const dueAmount = (allSuplier) => {
  let total = 0;
  if (allSuplier && allSuplier.length > 0) {
    allSuplier.forEach((item) => {
      total += item.currentBalance;
    });
  }

  return total.toLocaleString("en-IN");
};
