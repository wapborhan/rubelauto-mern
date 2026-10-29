import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import useProdType from "../../hooks/data/useProdType";
import SearchAbleDropDown from "../../components/shared/SearchAbleDropDown";
import { useGetSupplierQuery } from "../../redux/feature/api/supplierApi";
import { useSetproductMutation } from "../../redux/feature/api/productApi";

const AddProduct = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [proTypeList] = useProdType();
  const { data: allSuplier } = useGetSupplierQuery();
  const [setProduct, { isLoading, isSuccess, isError, error }] =
    useSetproductMutation();

  const [prodType, setProdType] = useState(null);
  const [supplier, setSupplier] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const inputData = {
      brandName: supplier?.bssName || "",
      brandImg: supplier?.bssLogoUrl || "",
      modelImg: form.modelImg.value.trim(),
      modelName: form.modelName.value.trim(),
      cashPrice: Number(form.cashPrice.value) || 0,
      creditPrice: Number(form.creditPrice.value) || 0,
      typeCode: prodType?.sku || "",
      sku: form.sku.value.trim(),
    };

    setProduct(inputData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "নতুন পণ্য সফলভাবে যোগ করা হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate("/products/view");
      }, 1500);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.error || "পণ্য যোগ করতে সমস্যা হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, error]);

  return (
    <div className="max-w-5xl mx-auto">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="pi pi-plus-circle text-blue-600 text-xl"></i>
            নতুন পণ্য যোগ করুন (Add New Product)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            মডেল, ব্র্যান্ড, মূল্য এবং পণ্য কোড সম্পর্কিত তথ্য পূরণ করুন
          </p>
        </div>
        <Link
          to="/products/view"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          পণ্য তালিকা দেখুন
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Section 1: ব্র্যান্ড ও ধরন */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ১
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                ব্র্যান্ড ও ক্যাটাগরি (Brand & Category)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* সরবরাহকারী / ব্র্যান্ড */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  সরবরাহকারী (Supplier / Brand) <span className="text-red-500">*</span>
                </label>
                <SearchAbleDropDown
                  state={supplier}
                  setState={setSupplier}
                  data={allSuplier?.data}
                  requir={true}
                  config={{
                    optLabel: "bssName",
                    placeHolder: "সরবরাহকারী নির্বাচন করুন",
                  }}
                />
              </div>

              {/* পণ্যের ধরন */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  পণ্যের ধরন (Product Type) <span className="text-red-500">*</span>
                </label>
                <select
                  value={prodType?.sku || ""}
                  onChange={(e) => {
                    const found = proTypeList?.find(
                      (item) => item.sku === e.target.value
                    );
                    setProdType(found || null);
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                >
                  <option value="">ধরন নির্বাচন করুন</option>
                  {(proTypeList || []).map((type) => (
                    <option key={type.sku || type.name} value={type.sku}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  পণ্য কোড / SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sku"
                  placeholder="যেমন: RN-100-RED"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: মডেল ও মূল্য */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ২
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                মডেল ও মূল্যের বিবরণ (Model & Pricing)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* মডেল নাম */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  মডেল নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="modelName"
                  placeholder="যেমন: Turbo 125cc"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              {/* নগদ মূল্য */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  নগদ মূল্য (Cash Price ৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="cashPrice"
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              {/* কিস্তি মূল্য */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  কিস্তি মূল্য (Credit Price ৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="creditPrice"
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              {/* মডেল ছবি URL */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  মডেলের ছবি URL (Photo URL)
                </label>
                <input
                  type="url"
                  name="modelImg"
                  placeholder="https://example.com/bike-image.jpg"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to="/products/view"
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              বাতিল
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="pi pi-spin pi-spinner text-sm"></i>
                  সংরক্ষণ করা হচ্ছে...
                </>
              ) : (
                <>
                  <i className="pi pi-check text-sm"></i>
                  পণ্য সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
