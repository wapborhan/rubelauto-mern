import moment from "moment";
import "../details/dsds.css";

const CusInfo = ({ singleCustomer }) => {
  const { cardno, saledate, accountInfo, customerInfo, productInfo, showRoom } =
    singleCustomer;
  // console.log(singleCustomer);

  const creditBalance = accountInfo?.hireprice;
  return (
    <>
      <div className="cusinfotable p-datatable p-component p-datatable-responsive-scroll  mt-4">
        <div className="grid lg:grid-cols-3 grid-cols-1 w-full">
          <div className="left w-full p-datatable-wrapper h-full">
            <table className="table table-bordered border-dark info w-full h-full p-datatable-table">
              <thead className="p-datatable-thead">
                <tr role="row">
                  <th scope="col" colSpan="6" className="text-center">
                    গ্রাহক তথ্য
                  </th>
                </tr>
              </thead>
              <tbody className="p-datatable-tbody">
                <tr>
                  <td className="tdwd1">কার্ড নং</td>
                  <td className="tdwd">{cardno}</td>
                </tr>
                <tr>
                  <td className="tdwd1">গ্রাহকের নাম</td>
                  <td className="tdwd">{customerInfo?.name}</td>
                </tr>
                <tr>
                  <td className="tdwd1">ঠিকানা</td>
                  {/* <td className="tdwd">{customerInfo?.address}</td> */}
                </tr>
                <tr>
                  <td className="tdwd1">মোবাইল</td>
                  <td className="tdwd">{customerInfo?.number}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="center w-full p-datatable-wrapper h-full">
            <table className="table table-bordered border-dark info w-full h-full p-datatable-table">
              <thead className="p-datatable-thead">
                <tr>
                  <th scope="col" colSpan="6" className="text-center">
                    বিক্রয় তথ্য
                  </th>
                </tr>
              </thead>
              <tbody className="p-datatable-tbody">
                <tr>
                  <td className="tdwd1">কন্ডিশন</td>
                  <td className="tdwd"></td>
                </tr>
                <tr>
                  <td className="tdwd1">মডেল</td>
                  <td className="tdwd">{productInfo?.models}</td>
                </tr>
                <tr>
                  <td className="tdwd1">ইঞ্জিন নং</td>
                  <td className="tdwd">{productInfo?.engine}</td>
                </tr>
                <tr>
                  <td className="tdwd1">চ্যাসিস নং</td>
                  <td className="tdwd">{productInfo?.chassis}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="right w-full p-datatable-wrapper h-full">
            <table className="table table-bordered border-dark info w-full h-full p-datatable-table">
              <thead className="p-datatable-thead">
                <tr>
                  <th scope="col" colSpan="6" className="text-center">
                    পণ্য তথ্য
                  </th>
                </tr>
              </thead>
              <tbody className="p-datatable-tbody">
                <tr>
                  <td className="tdwd1">শোরুম</td>
                  <td className="tdwd">{showRoom}</td>
                </tr>
                <tr>
                  <td className="tdwd1">বিক্রয়ের তারিখ</td>
                  <td className="tdwd">{moment(saledate).format("D/MM/YY")}</td>
                </tr>
                <tr>
                  <td className="tdwd1">বিক্রয় মূল্য</td>
                  <td className="tdwd">{accountInfo?.saleprice}</td>
                </tr>
                <tr>
                  <td className="tdwd1">কিস্তির তারিখ</td>
                  <td className="tdwd">
                    {moment(accountInfo?.insdate).format("D/MM/YY")}
                  </td>
                </tr>
                <tr>
                  <td className="tdwd1">কিস্তির পরিমাণ</td>
                  <td className="tdwd">{accountInfo?.insamount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CusInfo;
