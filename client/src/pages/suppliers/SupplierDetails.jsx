import { useParams } from "react-router-dom";
import { useGetSingleSupplierQuery } from "../../redux/feature/api/supplierApi";
import Loading from "../../components/shared/Loading";
import ViewSuplier from "./ViewSupplier";
import SupplierDetailPur from "./SupplierDetailPur";

const SuplierDetails = () => {
  const { id } = useParams();
  const {
    data: singleSuplier,
    isLoading,
    isError,
  } = useGetSingleSupplierQuery(id);

  // Handle loading and error states
  if (isLoading) {
    return <Loading />;
  }

  if (isError || !singleSuplier?.data) {
    return <p>Error loading supplier details. Please try again later.</p>;
  }
  const {
    bssName,
    bssLogoUrl,
    empName,
    email,
    mobile,
    address,
    openingBalance,
    currentBalance,
    totalPurchase,
    totalPayment,
    // eslint-disable-next-line no-unsafe-optional-chaining
  } = singleSuplier?.data;

  console.log(singleSuplier?.data);

  return (
    <>
      {/* <BackPage /> */}

      <fieldset className="mb-4 !p-10">
        <legend>সাপ্লায়ার তথ্য</legend>
        <div className="supplier my-5 grid grid-cols-5 gap-5">
          <div className="image flex items-center justify-center">
            <img
              src={bssLogoUrl}
              alt={bssName}
              className="w-full h-40 rounded-md border-8"
            />
          </div>
          <div className="infos space-y-2 col-span-3">
            <div className="flex items-center justify-start gap-2 w-full ">
              <span className="font-bold">সাপ্লালায়ার:</span>
              {bssName}
            </div>
            <div className="flex items-center justify-start gap-2 w-full ">
              <span className="font-bold">ঠিকানা:</span>
              {address}
            </div>
            <div className="flex items-center justify-start gap-2 w-full ">
              <span className="font-bold">কর্মচারীর নাম:</span>
              {empName}
            </div>
            <div className="flex items-center justify-start gap-2 w-full ">
              <span className="font-bold">মোবাইল:</span>
              {mobile}
            </div>
            <div className="flex items-center justify-start gap-2 w-full ">
              <span className="font-bold">Email:</span>
              {email}
            </div>
          </div>
          <div className="infos space-y-2">
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="font-bold">ওপেনিং ব্যালেন্স:</span>
              {openingBalance}
            </div>
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="font-bold">ক্রয়:</span>
              {totalPurchase}
            </div>
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="font-bold">পেমেন্ট:</span>
              {totalPayment}
            </div>
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="font-bold">বাকি:</span>
              {currentBalance}
            </div>
          </div>
        </div>
      </fieldset>
      <SupplierDetailPur supplierId={id} />
    </>
  );
};

export default SuplierDetails;
