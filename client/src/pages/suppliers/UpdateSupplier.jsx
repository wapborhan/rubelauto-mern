import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import {
  useGetSingleSupplierQuery,
  useSetUpdateSupplierMutation,
} from "../../redux/feature/api/supplierApi";
import { Dropdown } from "primereact/dropdown";
import useProdType from "../../hooks/data/useProdType";

const UpdateSuplier = () => {
  const { id } = useParams();
  const [proTypeList] = useProdType();
  const [prodType, setProdType] = useState(null);
  const { data: singleSuplier } = useGetSingleSupplierQuery(id);
  const toast = useRef(null);
  const navigate = useNavigate();
  const [setPost, { isSuccess, isError, error }] =
    useSetUpdateSupplierMutation();

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const openingBalance = form.openingBalance.value;
    const bssName = form.bssName.value;
    const empName = form.empName.value;
    const email = form.email.value;
    const mobile = form.mobile.value;
    const address = form.address.value;

    const inputData = {
      openingBalance,
      bssName,
      empName,
      prodType: prodType?.name,
      email,
      mobile,
      address,
    };
    // console.log(inputData);
    setPost({ id, inputData });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "Supplier",
        detail: "Data Update Successfully",
      });
      setTimeout(() => {
        navigate("/contact/supplier/view");
      }, 3000);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      toast.current.show({
        severity: "error",
        summary: "Info",
        detail: error,
      });
    }
  }, [isError, error]);

  return (
    <div className="addlead">
      <Toast
        ref={toast}
        pt={{
          message: ({ index }) => ({
            className: `bg-yellow-${((index > 5 && 5) || index || 1) * 100}`,
          }),
        }}
      />
      <div className="back">{/* <BackToHomePage /> */}</div>
      <div className="sect  py-4 w-full mx-auto">
        <div className="content space-y-5">
          <h2 className="text-center text-3xl mb-10">আপডেট সাপ্লালায়ার</h2>
        </div>
        <fieldset className="mb-4">
          <legend>আপডেট</legend>
          <form onSubmit={handleSubmit}>
            <div className="form space-y-5">
              <div className="frist flex gap-5 lg:flex-nowrap flex-wrap justify-between">
                <div className="form-control  w-full">
                  <label className="label">
                    <span className="label-text font-bold">
                      ওপেনিং ব্যালেন্স
                    </span>
                  </label>
                  <input
                    type="number"
                    name="openingBalance"
                    defaultValue={singleSuplier?.data?.openingBalance}
                    placeholder=" ওপেনিং ব্যালেন্স"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control  w-full">
                  <label className="label">
                    <span className="label-text font-bold">
                      সাপ্লালায়ার নাম
                    </span>
                  </label>
                  <input
                    type="text"
                    name="bssName"
                    defaultValue={singleSuplier?.data?.bssName}
                    placeholder="সাপ্লালায়ার নাম"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold">কর্মচারীর নাম</span>
                  </label>
                  <input
                    type="text"
                    name="empName"
                    defaultValue={singleSuplier?.data?.empName}
                    placeholder="কর্মচারীর নাম"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div className="third flex gap-5 lg:flex-nowrap flex-wrap justify-between">
                <div className="form-control w-full">
                  <label className="label flex justify-between items-center">
                    <span className="label-text font-bold">ব্যবসার ধরণ</span>
                    <span className="font-bold text-white px-3 bg-primary rounded-full">
                      {singleSuplier?.data?.prodType}
                    </span>
                  </label>
                  <Dropdown
                    value={prodType}
                    onChange={(e) => setProdType(e.value)}
                    options={proTypeList}
                    optionLabel="name"
                    placeholder="ব্যবসার ধরণ"
                    className="w-full md:w-14rem border-2"
                    // required
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold">ইমেইল</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    defaultValue={singleSuplier?.data?.email}
                    placeholder="ইমেইল"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold">
                      কর্মচারীর মোবাইল
                    </span>
                  </label>
                  <input
                    type="number"
                    name="mobile"
                    defaultValue={singleSuplier?.data?.mobile}
                    placeholder="কর্মচারীর মোবাইল"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control w-full ">
                  <label className="label">
                    <span className="label-text font-bold">ঠিকানা</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={singleSuplier?.data?.address}
                    placeholder="ঠিকানা"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div className="submit">
                <input
                  type="submit"
                  value="আপডেট সাপ্লালায়ার"
                  className="rounded-lg font-h2 mt-4 border-2-[#331A15] bg-primary w-full p-3 font-bold text-[18px] text-white cursor-pointer"
                />
              </div>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default UpdateSuplier;
