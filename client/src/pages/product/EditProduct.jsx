import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import useProdType from "../../hooks/data/useProdType";
import Loading from "../../components/shared/Loading";
import {
  useGetSingleProductQuery,
  useSetUpdateProductMutation,
} from "../../redux/feature/api/productApi";

const EditProduct = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: singleProduct,
    refetch,
    isLoading: isFetching,
  } = useGetSingleProductQuery(id);
  const [updateProduct, { isLoading: isUpdating, isSuccess, isError, error }] =
    useSetUpdateProductMutation();

  const [proTypeList] = useProdType();
  const [prodType, setProdType] = useState(null);

  const [brandImg, setBrandImg] = useState("");
  const [brandName, setBrandName] = useState("");
  const [sku, setSku] = useState("");
  const [modelImg, setModelImg] = useState("");
  const [modelName, setModelName] = useState("");
  const [cashPrice, setCashPrice] = useState("");
  const [creditPrice, setCreditPrice] = useState("");

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  useEffect(() => {
    if (singleProduct?.data) {
      setBrandImg(singleProduct.data.brandImg || "");
      setBrandName(singleProduct.data.brandName || "");
      setSku(singleProduct.data.sku || "");
      setModelImg(singleProduct.data.modelImg || "");
      setModelName(singleProduct.data.modelName || "");
      setCashPrice(singleProduct.data.cashPrice || "");
      setCreditPrice(singleProduct.data.creditPrice || "");
      if (proTypeList && singleProduct.data.typeCode) {
        setProdType(
          proTypeList.find((type) => type.sku === singleProduct.data.typeCode) || null
        );
      }
    }
  }, [singleProduct, proTypeList]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const inputData = {
      brandName,
      brandImg,
      modelImg,
      modelName,
      cashPrice: Number(cashPrice) || 0,
      creditPrice: Number(creditPrice) || 0,
      typeCode: prodType?.sku || "",
      sku,
    };

    updateProduct({ id, inputData });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "পণ্য তথ্য সফলভাবে আপডেট করা হয়েছে",
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
        error?.data?.message || error?.error || "পণ্য আপডেট করতে সমস্যা হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, error]);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="pi pi-pencil text-blue-600 text-xl"></i>
            পণ্য সম্পাদনা করুন (Edit Product)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            মডেল, মূল্য এবং ক্যাটাগরি হালনাগাদ করুন
          </p>
        </div>
        <Link
          to="/products/view"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          পণ্যের তালিকা দেখুন
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
              {/* ব্র্যান্ড নাম */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  ব্র্যান্ড নাম (Brand)
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="ব্র্যান্ডের নাম"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
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
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
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
                  value={cashPrice}
                  onChange={(e) => setCashPrice(e.target.value)}
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
                  value={creditPrice}
                  onChange={(e) => setCreditPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              {/* ব্র্যান্ড লোগো URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  ব্র্যান্ড লোগো URL
                </label>
                <input
                  type="url"
                  value={brandImg}
                  onChange={(e) => setBrandImg(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              {/* মডেল ছবি URL */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  মডেলের ছবি URL (Photo URL)
                </label>
                <input
                  type="url"
                  value={modelImg}
                  onChange={(e) => setModelImg(e.target.value)}
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
              disabled={isUpdating}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <i className="pi pi-spin pi-spinner text-sm"></i>
                  আপডেট হচ্ছে...
                </>
              ) : (
                <>
                  <i className="pi pi-check text-sm"></i>
                  আপডেট সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
