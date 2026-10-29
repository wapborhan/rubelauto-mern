import { useNavigate, useParams } from "react-router-dom";
import SaleForm from "./SaleForm";
import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { useSetCustomerMutation } from "../../redux/feature/api/customerApi";

const AddSale = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const path = useParams();
  const [setCustomer, { isLoading, isSuccess, isError, error }] = useSetCustomerMutation();

  const postData = (data) => {
    setCustomer({ leadsId: data?.leadsId, status: path?.status, data });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: `${path.status === "cash" ? "নগদ" : "কিস্তিতে"} বিক্রয় সফলভাবে সম্পন্ন হয়েছে`,
        life: 2000,
      });
      setTimeout(() => {
        navigate(path.status === "cash" ? `/customer/paid` : `/customer/running`);
      }, 1500);
    }
  }, [isSuccess, navigate, path]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.data || error?.error || "বিক্রয় সংরক্ষণ করতে সমস্যা হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, error]);

  return (
    <>
      <Toast ref={toast} />
      <SaleForm
        status={path.status}
        postData={postData}
        isSubmitting={isLoading}
      />
    </>
  );
};

export default AddSale;
