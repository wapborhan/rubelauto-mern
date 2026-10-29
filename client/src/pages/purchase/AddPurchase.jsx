import { useEffect, useRef, useState } from "react";
import DatePick from "../../components/shared/DatePick";
import { Toast } from "primereact/toast";
import { useGetproductQuery } from "../../redux/feature/api/productApi";
import { useGetShowroomQuery } from "../../redux/feature/api/showroomApi";
import { useSetPurchaseMutation } from "../../redux/feature/api/purchaseApi";
import { useNavigate, Link } from "react-router-dom";

const AddPurchase = () => {
  const toast = useRef(null);
  const { data: product, isLoading: isProductLoading } = useGetproductQuery();
  const { data: allShowroom, isLoading: isShowroomLoading } = useGetShowroomQuery();
  const [setPurchase, { isLoading, isSuccess, isError, error }] =
    useSetPurchaseMutation();
  const navigate = useNavigate();

  const [receivedDate, setReceivedDate] = useState(new Date());
  const [productInfo, setProductInfo] = useState(null);
  const [showroom, setShowroom] = useState(null);
  const [stock, setStock] = useState({ name: "Rubel Auto", code: "RA" });
  const [stockStat, setStockStat] = useState({ name: "New" });

  const stocks = [
    { name: "Rubel Auto", code: "RA" },
    { name: "Runner Automobiles PLC", code: "RAL" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    if (!productInfo) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "অনুগ্রহ করে গাড়ির মডেল নির্বাচন করুন",
        life: 3000,
      });
      return;
    }

    if (!showroom) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "অনুগ্রহ করে শোরুম নির্বাচন করুন",
        life: 3000,
      });
      return;
    }

    const inputData = {
      stockStatus: stockStat?.name || "New",
      receivedDate,
      categories: productInfo?.typeCode || productInfo?.type || "",
      modelCode: productInfo?.sku || "",
      brandName: productInfo?.brandName || "",
      modelName: productInfo?.modelName || "",
      engine: form.engine.value.trim(),
      chassis: form.chassis.value.trim(),
      color: form.color.value.trim(),
      stock: stock?.code || "RA",
      showroomName: showroom?.name || "",
      showroomCode: showroom?.code || "",
    };

    setPurchase(inputData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "নতুন গাড়ির স্টক সফলভাবে যোগ করা হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate("/purchase/view");
      }, 1500);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.error || "স্টক যোগ করতে ব্যর্থ হয়েছে";
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
            <i className="pi pi-box text-blue-600 text-xl"></i>
            স্টক ক্রয় / এন্ট্রি (Add Stock Purchase)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            নতুন মোটরসাইকেল/যানবাহন ক্রয় ও শোরুম স্টকে যুক্ত করুন
          </p>
        </div>
        <Link
          to="/purchase/view"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          স্টক তালিকা দেখুন
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Section 1: স্টকের সাধারণ বিবরণ */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ১
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                স্টক ও শোরুমের তথ্য (Stock & Showroom)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  গ্রহণের তারিখ <span className="text-red-500">*</span>
                </label>
                <DatePick
                  dateValue={receivedDate}
                  setDateValue={setReceivedDate}
                  iconShow={false}
                  endDate={9999}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  স্টক অবস্থা (Stock Status) <span className="text-red-500">*</span>
                </label>
                <select
                  value={stockStat?.name || "New"}
                  onChange={(e) => setStockStat({ name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                >
                  <option value="New">New</option>
                  <option value="Old">Old</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  শোরুম <span className="text-red-500">*</span>
                </label>
                <select
                  value={showroom?.code || ""}
                  onChange={(e) => {
                    const found = allShowroom?.find((s) => s.code === e.target.value);
                    setShowroom(found || null);
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                >
                  <option value="">শোরুম নির্বাচন করুন</option>
                  {(allShowroom || []).map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  স্টক টাইপ / উৎস <span className="text-red-500">*</span>
                </label>
                <select
                  value={stock?.code || "RA"}
                  onChange={(e) => {
                    const found = stocks.find((item) => item.code === e.target.value);
                    setStock(found || { code: e.target.value });
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                >
                  {stocks.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: গাড়ির নির্দিষ্ট বিবরণ */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ২
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                গাড়ির বিবরণ ও শনাক্তকরণ (Vehicle Identification)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  গাড়ির মডেল <span className="text-red-500">*</span>
                </label>
                <select
                  value={productInfo?.sku || ""}
                  onChange={(e) => {
                    const found = product?.data?.find((p) => p.sku === e.target.value);
                    setProductInfo(found || null);
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                >
                  <option value="">মডেল নির্বাচন করুন</option>
                  {(product?.data || []).map((p) => (
                    <option key={p.sku} value={p.sku}>
                      {p.modelName} ({p.brandName}) - {p.sku}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  রং (Color) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="color"
                  placeholder="যেমন: Red, Glossy Black"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ইঞ্জিন নম্বর (Engine No) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="engine"
                  placeholder="ইঞ্জিন নম্বর লিখুন"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-mono uppercase"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  চেসিস নম্বর (Chassis No) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="chassis"
                  placeholder="চেসিস নম্বর লিখুন"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-mono uppercase"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to="/purchase/view"
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
                  স্টকে যুক্ত করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPurchase;
