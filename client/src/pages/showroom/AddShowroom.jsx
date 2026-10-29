import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetShowroomMutation } from "../../redux/feature/api/showroomApi";

const AddShowroom = () => {
  const toast = useRef(null);
  const [setShowroom, { isSuccess, isError, error, isLoading }] =
    useSetShowroomMutation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value.trim();
    const code = form.code.value.trim();
    const address = form.address.value.trim();

    const inputData = {
      name,
      code,
      address,
      cashDue: 0,
      percentDue: 0,
      remainingBalance: 0,
    };
    setShowroom(inputData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.current.show({
        severity: "success",
        summary: "সফল",
        detail: "নতুন শোরুম সফলভাবে যোগ করা হয়েছে",
        life: 2000,
      });
      setTimeout(() => {
        navigate("/showroom/list");
      }, 1500);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      const errorMsg =
        error?.data?.message || error?.error || "শোরুম যোগ করতে সমস্যা হয়েছে";
      toast.current.show({
        severity: "error",
        summary: "ত্রুটি",
        detail: errorMsg,
        life: 3000,
      });
    }
  }, [isError, error]);

  return (
    <div className="addShowroom max-w-4xl mx-auto p-4">
      <Toast ref={toast} />

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6 pb-3 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            নতুন শোরুম যোগ করুন (Add Showroom)
          </h2>
          <Link
            to="/showroom/list"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium text-sm"
          >
            <i className="pi pi-arrow-left"></i>
            <span>শোরুমের তালিকা দেখুন</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                শোরুমের নাম (Showroom Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="যেমন: Dhaka Showroom"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="form-control">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                শোরুম কোড (Showroom Code) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                placeholder="যেমন: DHK-01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ঠিকানা (Address) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              rows="3"
              placeholder="শোরুমের বিস্তারিত ঠিকানা লিখুন"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/showroom/list")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition duration-200"
            >
              বাতিল (Cancel)
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow flex items-center gap-2 transition duration-200 disabled:opacity-50"
            >
              {isLoading && <i className="pi pi-spin pi-spinner"></i>}
              <span>সংরক্ষণ করুন (Save)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShowroom;
