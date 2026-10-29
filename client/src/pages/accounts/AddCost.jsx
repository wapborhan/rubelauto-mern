import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useCostList from "../../hooks/data/useCostList";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useSetCostMutation } from "../../redux/feature/api/costApi";
import DatePick from "../../components/shared/DatePick";

const AddCost = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const toast = useRef(null);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [costCat, setCostCat] = useState(null);
  const [costCatList] = useCostList();
  const { showRoom, email, name } = useSelector((state) => state.userStore);
  const [setPost, { isLoading, isSuccess, isError, error }] = useSetCostMutation();

  const onSubmit = (data) => {
    if (!costCat) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "খরচের ক্যাটাগরি নির্বাচন করুন",
        life: 3000,
      });
      return;
    }

    const inputData = {
      date: date || new Date(),
      staffEmail: email || "",
      categories: costCat?.code || costCat?.name || "",
      showroom: showRoom || "General",
      description: data.description?.trim(),
      amount: Number(data.amount) || 0,
    };

    setPost(inputData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "খরচের হিসাব সফলভাবে এন্ট্রি হয়েছে",
        life: 2000,
      });
      reset();
      setTimeout(() => {
        navigate("/account/cost/view");
      }, 1500);
    }
  }, [isSuccess, navigate, reset]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.error || "খরচের হিসাব যোগ করতে সমস্যা হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, error]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="pi pi-minus-circle text-rose-600 text-xl"></i>
            খরচের হিসাব এন্ট্রি (Add Cost)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            দৈনন্দিন বা অফিশিয়াল খরচের খাত ও টাকার পরিমাণ সংরক্ষণ করুন
          </p>
        </div>
        <Link
          to="/account/cost/view"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          খরচের তালিকা দেখুন
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-3 mb-2 border-b border-gray-100">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-50 text-rose-600 font-bold text-xs">
              <i className="pi pi-receipt text-xs"></i>
            </span>
            <h2 className="text-base font-semibold text-gray-800">
              খরচের বিবরণী (Expense Information)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                তারিখ <span className="text-red-500">*</span>
              </label>
              <DatePick
                dateValue={date}
                setDateValue={setDate}
                iconShow={false}
                endDate={9999}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                খরচের ক্যাটাগরি <span className="text-red-500">*</span>
              </label>
              <select
                value={costCat?.code || ""}
                onChange={(e) => {
                  const found = costCatList?.find((item) => item.code === e.target.value);
                  setCostCat(found || (e.target.value ? { code: e.target.value, name: e.target.value } : null));
                }}
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                required
              >
                <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                {(costCatList || []).map((cat) => (
                  <option key={cat.code || cat.name} value={cat.code}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                টাকার পরিমাণ (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="0.00"
                {...register("amount", { required: "টাকার পরিমাণ আবশ্যক" })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
              {errors.amount && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.amount.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                শোরুম
              </label>
              <input
                type="text"
                value={showRoom || "সকল / প্রধান শোরুম"}
                disabled
                className="w-full px-3.5 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-600 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                এন্ট্রি কারী স্টাফ
              </label>
              <input
                type="text"
                value={name || email || "বর্তমান ব্যবহারকারী"}
                disabled
                className="w-full px-3.5 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-600 outline-none cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                খরচের বিস্তারিত বিবরণ <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="খরচের নির্দিষ্ট কারণ বা বিস্তারিত নোট লিখুন..."
                {...register("description", { required: "বিবরণ আবশ্যক" })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
              />
              {errors.description && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to="/account/cost/view"
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              বাতিল
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="pi pi-spin pi-spinner text-sm"></i>
                  সংরক্ষণ করা হচ্ছে...
                </>
              ) : (
                <>
                  <i className="pi pi-check text-sm"></i>
                  খরচ সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCost;
