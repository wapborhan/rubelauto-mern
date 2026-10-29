import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useEffect } from "react";

const MemoForm = ({ onSave, editProduct, resetEdit }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
      partNo: "",
      model: "",
      company: "",
      quantity: 0,
      unitType: "pcs",
      rate: 0,
      discount: 0,
    },
  });

  // if editProduct changes, pre-fill form
  useEffect(() => {
    if (editProduct) {
      for (const key in editProduct) {
        setValue(key, editProduct[key]);
      }
    } else {
      reset();
    }
  }, [editProduct, setValue, reset]);

  const onSubmit = (data) => {
    onSave(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            পণ্যের বিবরণ (Description) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="পণ্যের নাম লিখুন"
            {...register("description", { required: "পণ্যের নাম আবশ্যক" })}
            className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
          {errors.description && (
            <small className="text-red-500 text-xs mt-0.5 block">
              {errors.description.message}
            </small>
          )}
        </div>

        {/* Part No */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            পার্ট নম্বর (Part No.)
          </label>
          <input
            type="text"
            placeholder="পার্টস নং"
            {...register("partNo")}
            className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-mono"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            মডেল (Model)
          </label>
          <select
            {...register("model")}
            className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          >
            <option value="">মডেল নির্বাচন করুন</option>
            <option value="Pulser 150">Pulsar 150</option>
            <option value="Dayang 80">Dayang 80</option>
          </select>
        </div>

        {/* Company */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            কোম্পানি (Brand / Company)
          </label>
          <select
            {...register("company")}
            className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          >
            <option value="">কোম্পানি নির্বাচন করুন</option>
            <option value="CRLF">CRLF</option>
            <option value="Rolon">Rolon</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Quantity + Unit Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            পরিমাণ ও একক (Qty & Unit) <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              placeholder="পরিমাণ"
              {...register("quantity", {
                required: "পরিমাণ আবশ্যক",
                min: 1,
              })}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold"
            />
            <select
              {...register("unitType", {
                required: "একক আবশ্যক",
              })}
              className="px-2.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            >
              <option value="pcs">Pcs</option>
              <option value="Set">Set</option>
              <option value="cartoon">Cartoon</option>
              <option value="box">Box</option>
              <option value="dozen">Dozen</option>
            </select>
          </div>
          {(errors.quantity || errors.unitType) && (
            <small className="text-red-500 text-xs mt-0.5 block">
              {errors.quantity?.message || errors.unitType?.message}
            </small>
          )}
        </div>

        {/* Rate */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            দর (Rate ৳) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            step="any"
            placeholder="0.00"
            {...register("rate", { required: "দর আবশ্যক", min: 1 })}
            className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold text-blue-600"
          />
          {errors.rate && (
            <small className="text-red-500 text-xs mt-0.5 block">
              {errors.rate.message}
            </small>
          )}
        </div>

        {/* Discount */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            ছাড় (Discount %)
          </label>
          <input
            type="number"
            step="any"
            placeholder="0"
            {...register("discount")}
            className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
          >
            <i className={`pi ${editProduct ? "pi-check" : "pi-plus"} text-xs`}></i>
            {editProduct ? "আপডেট" : "আইটেম যোগ"}
          </button>
          {editProduct && (
            <button
              type="button"
              onClick={() => {
                reset();
                resetEdit();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              বাতিল
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

MemoForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  editProduct: PropTypes.object,
  resetEdit: PropTypes.func.isRequired,
};

export default MemoForm;
