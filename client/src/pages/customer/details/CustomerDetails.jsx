import { useNavigate, useParams } from "react-router-dom";
import CusInfo from "./CusInfo";
import CusAccountInfo from "./CusAccountInfo";
import Loading from "../../../components/shared/Loading";
import { useGetSingleCustomerQuery } from "../../../redux/feature/api/customerApi";
import { Button } from "primereact/button";

const CustomerDetails = () => {
  const { cardNo } = useParams();
  const navigate = useNavigate();
  const { data: singleCustomer } = useGetSingleCustomerQuery(cardNo);

  const handlePrintByClass = () => {
    const printableElement = document.querySelector(".customer-info");

    if (printableElement) {
      const originalContents = document.body.innerHTML;
      const printContents = printableElement.innerHTML;

      document.body.innerHTML = `
      <html>
        <head>
          <title>Print</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              width: 100%;
              max-width: 1200px;
              margin: auto;
            }

            @media print {
              body {
                zoom: 100%;
                width: 100%;
              }
              .grid-cols-1 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `;

      window.print();

      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };
  return (
    <div>
      <div className="customer">
        <div className="backButton">
          <Button
            type="button"
            icon="pi pi-backward"
            label="পেছনের পেজ"
            onClick={() => navigate(-1)}
            data-pr-tooltip="Back"
            className="p-badge-danger border-2 !bg-[#198754] px-4 py-2 text-white"
          />{" "}
          <Button
            type="button"
            icon="pi pi-print"
            label="কার্ড প্রিন্ট"
            onClick={handlePrintByClass}
            data-pr-tooltip="Back"
            className="p-badge-danger border-2 !bg-[#198754] px-4 py-2 text-white"
          />
        </div>
        <div className="company text-center space-y-5">
          <h2 className="text-4xl font-bold">Customer Ledger</h2>
          <h2 className="text-3xl">Rubel Auto</h2>
        </div>
        <div className="customer-info">
          {singleCustomer ? (
            <>
              <fieldset
                className="!p-0"
                // style={{ padding: "0px 0px !important" }}
              >
                <legend>কাস্টমার তথ্য</legend>
                <CusInfo singleCustomer={singleCustomer?.data} />
              </fieldset>

              <fieldset className="pt-2 !p-0" style={{ marginTop: "20px" }}>
                <legend>কিস্তির তথ্য</legend>
                <CusAccountInfo singleCustomer={singleCustomer?.data} />
              </fieldset>
            </>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
