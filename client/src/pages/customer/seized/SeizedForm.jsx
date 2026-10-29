import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SeizedForm = ({ postData, isSubmitting, cardNo }) => {
  const { name } = useSelector((state) => state.userStore);
  const [seizedCost, setSeizedCost] = useState(0);
  const [coments, setComents] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const inputData = {
      date: new Date(),
      seizedCost: Number(seizedCost) || 0,
      staff: name || "Admin",
      type: "seized",
      coments: coments.trim(),
    };

    postData(inputData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 pb-3 mb-2 border-b border-gray-100">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-600 font-bold text-xs">
            <i className="pi pi-lock text-xs"></i>
          </span>
          <h2 className="text-base font-semibold text-gray-800">
            জব্দকরণের বিবরণ ও খরচ (Seizure Information & Costs)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              তারিখ
            </label>
            <input
              type="text"
              value={new Date().toLocaleDateString("bn-BD")}
              disabled
              className="w-full px-3.5 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-600 outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              জব্দকারী কর্মকর্তা (Staff)
            </label>
            <input
              type="text"
              value={name || "অ্যাডমিন"}
              disabled
              className="w-full px-3.5 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-600 outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              জব্দকরণ সংক্রান্ত খরচ (৳)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={seizedCost}
              onChange={(e) => setSeizedCost(e.target.value)}
              placeholder="0.00"
              className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold text-amber-700"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              মন্তব্য / জব্দের কারণ ও বিবরণ <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={coments}
              onChange={(e) => setComents(e.target.value)}
              placeholder="জব্দ করার কারণ, গাড়ির বর্তমান অবস্থা বা প্রয়োজনীয় নোট লিখুন..."
              required
              className="w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            to={cardNo ? `/customer/view/${cardNo}` : "/customer/running"}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            বাতিল
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <i className="pi pi-spin pi-spinner text-sm"></i>
                প্রক্রিয়াধীন...
              </>
            ) : (
              <>
                <i className="pi pi-check text-sm"></i>
                জব্দ তালিকায় অন্তর্ভুক্ত করুন
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeizedForm;
