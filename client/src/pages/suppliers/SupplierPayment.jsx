import { Toast } from "primereact/toast";
import DatePick from "../../components/shared/DatePick";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import Loading from "../../components/shared/Loading";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleSupplierQuery,
  useSetSupplierPaymentMutation,
} from "../../redux/feature/api/supplierApi";

const SupplierPayment = () => {
  const toast = useRef(null);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // API hooks
  const {
    data: supplierData,
    isLoading,
    error,
  } = useGetSingleSupplierQuery(id);
  const [setPayment, { isSuccess, isError, error: payError, data }] =
    useSetSupplierPaymentMutation(id);

  console.log(supplierData);

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "পেমেন্ট সফলভাবে যোগ করা হয়েছে",
        life: 3000,
      });
      console.log(data);

      // setTimeout(() => {
      //   navigate(`/contact/supplier/view/${id}`);
      // }, 2000);
    }
  }, [isSuccess, navigate, id, data]);

  useEffect(() => {
    if (isError) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: payError?.data?.message || "Something went wrong",
        life: 3000,
      });
    }
  }, [isError, payError]);

  if (isLoading) return <Loading />;

  // dropdown options
  const paymentTypeList = [
    { name: "নগদ", code: "cash" },
    { name: "ব্যাঙ্ক ট্রান্সফার", code: "bank" },
    { name: "মোবাইল ব্যাংকিং", code: "mobile" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const amount = Number(form.amount.value);

    const paymentData = {
      supplierId: id,
      paymentDate: date,
      payeAccountNumber: form.payeAccountNumber.value || "",
      amount,
      notes,
      payMethod: selectedMethod?.code,
    };

    setPayment({ id, data: paymentData });
  };

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="sect py-4 w-full mx-auto">
        <div className="content mb-4">
          <h2 className="text-center text-3xl">সরবরাহকারীর পেমেন্ট</h2>
        </div>
        <fieldset className="mb-4">
          <legend>সরবরাহকারীর তথ্য</legend>
          <div className="card mt-4 grid lg:grid-cols-4 mx-auto w-full text-center">
            <h1>নাম: {supplierData?.data?.bssName}</h1>
            <h1>কর্মচারীর নাম: {supplierData?.data?.empName}</h1>
            <h1>মোবাইল: {supplierData?.data?.mobile}</h1>
            <h1>বাকী: {supplierData?.data?.currentBalance}</h1>
          </div>
        </fieldset>

        <Toast ref={toast} />
        <form onSubmit={handleSubmit}>
          <div className="form lg:mx-36 my-10 space-y-4">
            <fieldset className="mb-4 p-4">
              <legend>পেমেন্ট ফর্ম</legend>

              {/* Date */}
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-bold">পেমেন্ট তারিখ</span>
                </label>
                <DatePick
                  dateValue={date}
                  setDateValue={setDate}
                  iconShow={false}
                  endDate={9999}
                  required
                />
              </div>

              {/* Account */}
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-bold">
                    প্রাপক অ্যাকাউন্ট
                  </span>
                </label>

                <input
                  type="text"
                  name="payeAccountNumber"
                  placeholder="প্রাপকের অ্যাকাউন্ট নম্বর"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Amount */}
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-bold">পরিমাণ</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="পরিমাণ"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-bold">পেমেন্ট পদ্ধতি</span>
                </label>
                <Dropdown
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.value)}
                  options={paymentTypeList}
                  optionLabel="name"
                  placeholder="পেমেন্ট পদ্ধতি নির্বাচন করুন"
                  className="w-full md:w-14rem"
                />
              </div>

              {/* Notes */}
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-bold">নোট</span>
                </label>
                <InputTextarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  cols={30}
                  placeholder="নোট"
                  className="input input-bordered w-full h-20"
                />
              </div>

              {/* Submit */}
              <div className="submit mb-4">
                <input
                  type="submit"
                  value="পেমেন্ট যোগ করুন"
                  className="rounded-lg border-2-[#331A15] bg-[#D2B48C] w-full p-3 font-bold text-[18px] text-[#331A15] cursor-pointer"
                />
              </div>
            </fieldset>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierPayment;
