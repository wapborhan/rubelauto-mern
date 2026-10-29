import { useRef, useState } from "react";
import DatePick from "../../components/shared/DatePick";
import useProdType from "../../hooks/data/useProdType";
import SearchAbleDropDown from "../../components/shared/SearchAbleDropDown";
import { Toast } from "primereact/toast";
import { useGetLeadQuery } from "../../redux/feature/api/leadApi";
import { useGetproductQuery } from "../../redux/feature/api/productApi";
import { useGetPurchaseQuery } from "../../redux/feature/api/purchaseApi";
import { useGetShowroomQuery } from "../../redux/feature/api/showroomApi";
import { Link } from "react-router-dom";

const SaleForm = ({ status, postData, isSubmitting }) => {
  const toast = useRef(null);
  const [showroom, setShowroom] = useState(null);

  const [customerInfo, setCustomerInfo] = useState(null);
  const [saledate, setSaleDate] = useState(new Date());
  const [insdate, setInsdate] = useState(null);
  const [conddate, setConddate] = useState(null);

  const [productType, setProductType] = useState(null);
  const [model, setModel] = useState(null);
  const [selectedEnCn, setSelectedEnCn] = useState(null);
  const [saleprice, setSaleprice] = useState("");
  const [proCond, setProCond] = useState({ cond: "New" });

  const { data: leads } = useGetLeadQuery();
  const { data: allShowroom } = useGetShowroomQuery();
  const [proTypeList] = useProdType();
  const { data: product } = useGetproductQuery();
  const { data: stock } = useGetPurchaseQuery();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    if (!showroom) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "অনুগ্রহ করে শোরুম নির্বাচন করুন",
        life: 3000,
      });
      return;
    }

    if (!customerInfo) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "অনুগ্রহ করে গ্রাহক নির্বাচন করুন",
        life: 3000,
      });
      return;
    }

    if (!model || !selectedEnCn) {
      toast.current.show({
        severity: "warn",
        summary: "সতর্কতা",
        detail: "অনুগ্রহ করে গাড়ির মডেল এবং ইঞ্জিন/চেসিস নির্বাচন করুন",
        life: 3000,
      });
      return;
    }

    const cardno = form.cardno.value.trim();
    const productCond = proCond?.cond || "New";
    const showRoom = showroom?.name || "";
    const models = model?.modelName || "";
    const type = productType?.name || "";
    const engine = selectedEnCn?.engine || "";
    const color = selectedEnCn?.color || "";
    const chassis = selectedEnCn?.chassis || "";
    const dpamount = Number(form.dpamount.value) || 0;
    const finalSalePrice = Number(saleprice || form.saleprice?.value) || 0;
    const agrefee = Number(form.agrefee?.value) || 0;

    const term = status === "cash" ? null : Number(form.term?.value) || 0;
    const percentage = status === "cash" ? null : Number(form.percentage?.value) || 0;
    const hirevalue = status === "cash" ? null : Number(form.hireprice?.value) || 0;
    const insamount = status === "cash" ? null : Number(form.insamount?.value) || 0;
    const condamount = status === "cash" ? null : Number(form.condamount?.value) || 0;

    const cardSts = {
      type: status === "cash" ? "paid" : "running",
      staff: null,
      paidDate: status === "cash" ? new Date() : null,
      paidDiscount: null,
      seizedDate: null,
      seizedCost: 0,
      docStatus: null,
      docDate: null,
      coments: null,
    };

    const inputData = {
      saleStatus: status,
      saledate,
      productCond,
      cardno,
      showRoom,
      cardStatus: cardSts,
      customerInfo,
      leadsId: customerInfo?._id,
      productInfo: { type, models, engine, chassis, color },
      accountInfo: {
        saleprice: finalSalePrice,
        dpamount,
        term,
        percentage,
        insdate,
        hireprice: hirevalue ? hirevalue - finalSalePrice : 0,
        insamount,
        conddate,
        condamount,
        agrefee,
      },
      installment: {},
    };

    postData(inputData);
  };

  // Filter product based on the type
  const filteredModel = productType
    ? product?.data?.filter((m) => m.typeCode === productType.sku)
    : [];

  // Filter stock based on the model sku
  const filteredStock = model
    ? stock?.data?.filter((s) => s.modelCode === model.sku)
    : [];

  // Format customer address safely
  const formattedAddress = customerInfo?.address
    ? typeof customerInfo.address === "object"
      ? [
          customerInfo.address.village,
          customerInfo.address.union,
          customerInfo.address.upazila,
          customerInfo.address.district,
        ]
          .filter(Boolean)
          .join(", ")
      : customerInfo.address
    : "";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className={`pi ${status === "cash" ? "pi-shopping-cart text-emerald-600" : "pi-percentage text-blue-600"} text-xl`}></i>
            {status === "cash"
              ? "নতুন নগদ বিক্রয় (Cash Sale)"
              : "কিস্তিতে বিক্রয় (Hire Purchase / Credit Sale)"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            গ্রাহক ও গাড়ির স্টক তথ্য মিলিয়ে বিক্রয় চালান ও অ্যাকাউন্ট এন্ট্রি করুন
          </p>
        </div>
        <Link
          to={`/customer/${status === "cash" ? "paid" : "running"}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <i className="pi pi-arrow-left text-xs"></i>
          বিক্রয় তালিকা
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Section 1: বিক্রয় ও গ্রাহকের বিবরণ */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ১
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                বিক্রয় ও গ্রাহকের তথ্য (Sale & Customer Information)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  বিক্রয় তারিখ <span className="text-red-500">*</span>
                </label>
                <DatePick
                  dateValue={saledate}
                  setDateValue={setSaleDate}
                  iconShow={false}
                  endDate={9999}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  গাড়ির অবস্থা (Condition) <span className="text-red-500">*</span>
                </label>
                <select
                  value={proCond?.cond || "New"}
                  onChange={(e) => setProCond({ cond: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                >
                  <option value="New">New</option>
                  <option value="Resale">Resale</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  শোরুম <span className="text-red-500">*</span>
                </label>
                <SearchAbleDropDown
                  state={showroom}
                  setState={setShowroom}
                  data={allShowroom}
                  requir={true}
                  config={{
                    optLabel: "name",
                    placeHolder: "শোরুম নির্বাচন করুন",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  কার্ড নম্বর (Card No) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cardno"
                  placeholder="কার্ড নং লিখুন"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-mono font-semibold text-blue-700"
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50/60 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    গ্রাহক নির্বাচন করুন <span className="text-red-500">*</span>
                  </label>
                  <SearchAbleDropDown
                    state={customerInfo}
                    setState={setCustomerInfo}
                    data={leads?.data || []}
                    requir={true}
                    config={{
                      optLabel: "name",
                      placeHolder: "গ্রাহক খুঁজুন",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="text"
                    value={customerInfo?.number || ""}
                    disabled
                    placeholder="স্বয়ংক্রিয় পূরণ হবে"
                    className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-600 outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    পিতা / স্বামীর নাম
                  </label>
                  <input
                    type="text"
                    value={customerInfo?.coname || ""}
                    disabled
                    placeholder="স্বয়ংক্রিয় পূরণ হবে"
                    className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-600 outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    ঠিকানা
                  </label>
                  <input
                    type="text"
                    value={formattedAddress}
                    disabled
                    placeholder="স্বয়ংক্রিয় পূরণ হবে"
                    className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-600 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: গাড়ির বিবরণ ও স্টক নির্বাচন */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ২
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                গাড়ির মডেল ও স্টক নির্বাচন (Vehicle & Inventory Selection)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  পণ্যের ক্যাটাগরি / টাইপ <span className="text-red-500">*</span>
                </label>
                <select
                  value={productType?.sku || ""}
                  onChange={(e) => {
                    const found = proTypeList?.find((item) => item.sku === e.target.value);
                    setProductType(found || null);
                    setModel(null);
                    setSelectedEnCn(null);
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  required
                >
                  <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                  {(proTypeList || []).map((t) => (
                    <option key={t.sku || t.name} value={t.sku}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  গাড়ির মডেল <span className="text-red-500">*</span>
                </label>
                <select
                  value={model?.sku || ""}
                  onChange={(e) => {
                    const found = filteredModel?.find((m) => m.sku === e.target.value);
                    setModel(found || null);
                    setSelectedEnCn(null);
                    const defaultP = status === "cash" ? found?.cashPrice : found?.creditPrice;
                    setSaleprice(defaultP || "");
                  }}
                  disabled={!productType}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">মডেল নির্বাচন করুন</option>
                  {(filteredModel || []).map((m) => (
                    <option key={m.sku} value={m.sku}>
                      {m.modelName} ({m.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ইঞ্জিন নম্বর (স্টক থেকে) <span className="text-red-500">*</span>
                </label>
                <SearchAbleDropDown
                  state={selectedEnCn}
                  setState={setSelectedEnCn}
                  data={filteredStock}
                  requir={true}
                  config={{
                    optLabel: "engine",
                    placeHolder: "ইঞ্জিন নং নির্বাচন করুন",
                  }}
                  disable={!model}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  চেসিস নম্বর ও রং
                </label>
                <input
                  type="text"
                  value={
                    selectedEnCn
                      ? `${selectedEnCn.chassis || ""} (${selectedEnCn.color || ""})`
                      : ""
                  }
                  disabled
                  placeholder="স্বয়ংক্রিয় নির্বাচন হবে"
                  className="w-full px-3.5 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-600 outline-none cursor-not-allowed font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: মূল্য ও আর্থিক বিবরণ */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ৩
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                মূল্য, কিস্তি ও আর্থিক হিসাব (Pricing & Installment Terms)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  বিক্রয় মূল্য (Sale Price ৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="saleprice"
                  value={saleprice}
                  onChange={(e) => setSaleprice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ডাউন পেমেন্ট (Down Payment ৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="dpamount"
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold text-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  এগ্রিমেন্ট ফি (Agreement Fee ৳)
                </label>
                <input
                  type="number"
                  name="agrefee"
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
            </div>

            {/* Credit / Hire Purchase Fields */}
            {status !== "cash" && (
              <div className="p-5 bg-blue-50/40 rounded-xl border border-blue-100 space-y-4">
                <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  কিস্তি ও ভাড়াক্রয় শর্তাবলী (Hire Purchase Details)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      কিস্তির সংখ্যা (Terms/Months) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="term"
                      placeholder="যেমন: ১২, ১৮ বা ২৪"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      লাভের হার (Percentage %) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="percentage"
                      placeholder="যেমন: ১৫"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      হায়ার প্রাইস (Total Hire Price ৳) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="hireprice"
                      placeholder="মোট কিস্তিমূল্য"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold text-blue-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      কিস্তি শুরুর তারিখ <span className="text-red-500">*</span>
                    </label>
                    <DatePick
                      dateValue={insdate}
                      setDateValue={setInsdate}
                      iconShow={true}
                      endDate={40}
                      requir={true}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      মাসিক কিস্তির পরিমাণ (৳) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="insamount"
                      placeholder="প্রতি মাসের কিস্তির টাকা"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold text-indigo-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      কন্ডিশন তারিখ
                    </label>
                    <DatePick
                      dateValue={conddate}
                      setDateValue={setConddate}
                      iconShow={true}
                      endDate={15}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      কন্ডিশন পরিমাণ (৳)
                    </label>
                    <input
                      type="number"
                      name="condamount"
                      placeholder="কন্ডিশন টাকা"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to={`/customer/${status === "cash" ? "paid" : "running"}`}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              বাতিল
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white ${
                status === "cash" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
              } rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <i className="pi pi-spin pi-spinner text-sm"></i>
                  বিক্রয় সম্পন্ন হচ্ছে...
                </>
              ) : (
                <>
                  <i className="pi pi-check text-sm"></i>
                  বিক্রয় সম্পন্ন করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;
