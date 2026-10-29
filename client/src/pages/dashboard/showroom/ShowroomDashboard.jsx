import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import { useGetCustomerQuery } from "../../../redux/feature/api/customerApi";
import { useGetLeadQuery } from "../../../redux/feature/api/leadApi";
import { useGetPurchaseQuery } from "../../../redux/feature/api/purchaseApi";
import { useGetIncomeQuery } from "../../../redux/feature/api/incomeApi";
import { useGetCostQuery } from "../../../redux/feature/api/costApi";
import {
  calculateCustomerDues,
  calculateSummaryTotals,
} from "../../customer/customerCalculations";

const ShowroomDashboard = () => {
  const { showRoom } = useSelector((state) => state.userStore);

  const { data: runningData, isLoading: isCustLoading } = useGetCustomerQuery({
    path: "running",
    showRoom,
  });
  const { data: seizedData } = useGetCustomerQuery({
    path: "seized",
    showRoom,
  });
  const { data: leadsData } = useGetLeadQuery();
  const { data: stockData } = useGetPurchaseQuery();
  const { data: incomeData } = useGetIncomeQuery(showRoom);
  const { data: costData } = useGetCostQuery(showRoom);

  const runningCustomers = runningData?.data || [];
  const seizedCustomers = seizedData?.data || [];
  const leads = leadsData?.data || [];
  const stocks = stockData?.data || [];
  const incomes = incomeData?.data || [];
  const costs = costData?.data || [];

  // Live calculation of summary dues (Contract Due & Installment Dawa)
  const duesSummary = useMemo(
    () => calculateSummaryTotals(runningCustomers),
    [runningCustomers]
  );

  // Filter stocks by showroom if not Head Office
  const filteredStocks = useMemo(() => {
    if (showRoom && showRoom !== "Head Office") {
      return stocks.filter((s) => s.showroomName === showRoom);
    }
    return stocks;
  }, [stocks, showRoom]);

  // Total Income & Expense calculations
  const totalIncome = useMemo(
    () => incomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [incomes]
  );
  const totalCost = useMemo(
    () => costs.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [costs]
  );

  // Stock status counts
  const stockNewCount = filteredStocks.filter(
    (s) => s.stockStatus === "New"
  ).length;

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Running Customers Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                চলতি গ্রাহক (Running)
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                {isCustLoading ? "..." : runningCustomers.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
              <i className="pi pi-users"></i>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">কিস্তিতে চলমান বিক্রি</span>
            <Link
              to="/customer/running"
              className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              দেখুন <i className="pi pi-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>

        {/* Total Installment Dawa (কিস্তি দাবি) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                মোট কিস্তি দাবি (Dawa)
              </p>
              <h3 className="text-2xl font-extrabold text-red-600 mt-1">
                ৳ {duesSummary.totalInstallmentDueSum.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl">
              <i className="pi pi-money-bill"></i>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">বর্তমান বকেয়া কিস্তি</span>
            <Link
              to="/customer/running"
              className="font-semibold text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              আদায় করুন <i className="pi pi-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>

        {/* Total Contract Due (মোট চুক্তির বকেয়া) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                চুক্তির মোট বকেয়া
              </p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
                ৳ {duesSummary.totalContractDueSum.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
              <i className="pi pi-wallet"></i>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              জমা পড়েছে: ৳ {duesSummary.totalInstallmentPaidSum.toLocaleString()}
            </span>
            <Link
              to="/customer/running"
              className="font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-1"
            >
              বিবরণী <i className="pi pi-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>

        {/* Vehicle Stock Available */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                গাড়ির মোট স্টক (Stock)
              </p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                {filteredStocks.length} টি
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <i className="pi pi-box"></i>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              নতুন: {stockNewCount} টি
            </span>
            <Link
              to="/purchase/view"
              className="font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
            >
              স্টক তালিকা <i className="pi pi-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Secondary Metrics: Leads, Seized, Income, Cost */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-gray-500 font-medium">সম্ভাব্য লিড (Leads)</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">{leads.length}</p>
          </div>
          <Link
            to="/contact/lead/view"
            className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors"
            title="লিড দেখুন"
          >
            <i className="pi pi-user-plus text-sm"></i>
          </Link>
        </div>

        {/* Seized Vehicles */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-gray-500 font-medium">জব্দকৃত গাড়ি (Seized)</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">{seizedCustomers.length}</p>
          </div>
          <Link
            to="/customer/seized"
            className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-colors"
            title="জব্দকৃত গাড়ি দেখুন"
          >
            <i className="pi pi-lock text-sm"></i>
          </Link>
        </div>

        {/* Showroom Income */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-gray-500 font-medium">মোট আয় (Income)</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">৳ {totalIncome.toLocaleString()}</p>
          </div>
          <Link
            to="/account/income/view"
            className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
            title="আয়ের তালিকা দেখুন"
          >
            <i className="pi pi-arrow-down-left text-sm"></i>
          </Link>
        </div>

        {/* Showroom Cost */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-gray-500 font-medium">মোট খরচ (Cost)</p>
            <p className="text-xl font-bold text-red-600 mt-0.5">৳ {totalCost.toLocaleString()}</p>
          </div>
          <Link
            to="/account/cost/view"
            className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors"
            title="খরচের তালিকা দেখুন"
          >
            <i className="pi pi-arrow-up-right text-sm"></i>
          </Link>
        </div>
      </div>

      {/* 3. Quick Action Shortcuts Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          দ্রুত অ্যাকশন (Quick Actions)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/sale/credit"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-shopping-cart text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">নতুন বিক্রি</span>
          </Link>

          <Link
            to="/customer/running"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-credit-card text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">কিস্তি জমা গ্রহণ</span>
          </Link>

          <Link
            to="/contact/lead/add"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-user-plus text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">নতুন লিড</span>
          </Link>

          <Link
            to="/purchase/add"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-arrow-circle-up text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">গাড়ি ক্রয় এন্ট্রি</span>
          </Link>

          <Link
            to="/account/cost/add"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-red-500 hover:bg-red-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-minus-circle text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">খরচ এন্ট্রি</span>
          </Link>

          <Link
            to="/account/income/add"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-plus-circle text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">আয় এন্ট্রি</span>
          </Link>
        </div>
      </div>

      {/* 4. Recent Running Customers & Quick Collection Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-bold text-gray-800 text-base">
              সাম্প্রতিক কিস্তি ও গ্রাহক বিবরণী (Recent Running Customers)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              বকেয়া কিস্তি আদায় ও গ্রাহকের প্রোফাইল এক নজরে
            </p>
          </div>
          <Link
            to="/customer/running"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1.5 transition-colors"
          >
            <span>সকল গ্রাহক দেখুন</span>
            <i className="pi pi-arrow-right text-[10px]"></i>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs">
                <th className="py-3 px-3.5 text-center w-12">ক্রঃ</th>
                <th className="py-3 px-3.5">বিক্রি তারিখ</th>
                <th className="py-3 px-3.5">কার্ড নং</th>
                <th className="py-3 px-3.5">গ্রাহকের নাম</th>
                <th className="py-3 px-3.5">মোবাইল</th>
                <th className="py-3 px-3.5">মডেল</th>
                <th className="py-3 px-3.5 text-right">চুক্তির বকেয়া</th>
                <th className="py-3 px-3.5 text-right">কিস্তি দাবি (Dawa)</th>
                <th className="py-3 px-3.5 text-center w-24">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {runningCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400">
                    কোনো চলতি গ্রাহকের তথ্য নেই
                  </td>
                </tr>
              ) : (
                runningCustomers.slice(0, 6).map((row, index) => {
                  const dues = calculateCustomerDues(row);
                  return (
                    <tr
                      key={row._id || index}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="py-2.5 px-3.5 text-center text-gray-500 font-mono text-xs">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3.5 text-gray-700 text-xs whitespace-nowrap">
                        {row.saledate
                          ? moment(row.saledate).format("DD-MMM-YYYY")
                          : "—"}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {row.cardno}
                      </td>
                      <td className="py-2.5 px-3.5 font-medium text-gray-900 whitespace-nowrap">
                        {row.customerInfo?.name || "—"}
                      </td>
                      <td className="py-2.5 px-3.5 text-gray-600 font-mono text-xs whitespace-nowrap">
                        {row.customerInfo?.number || "—"}
                      </td>
                      <td className="py-2.5 px-3.5 text-gray-800 whitespace-nowrap">
                        {row.productInfo?.models || "—"}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-semibold text-gray-800 whitespace-nowrap">
                        ৳ {dues.totalContractDue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                        {dues.installmentDue > 0 ? (
                          <span className="font-bold text-red-600">
                            ৳ {dues.installmentDue.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            পরিশোধিত
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            to={`/customer/payment/${row.cardno}`}
                            className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded border border-emerald-200 transition-colors"
                            title="কিস্তি জমা নিন"
                          >
                            <i className="pi pi-money-bill text-xs"></i>
                          </Link>
                          <Link
                            to={`/customer/view/${row.cardno}`}
                            className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded border border-blue-200 transition-colors"
                            title="বিস্তারিত দেখুন"
                          >
                            <i className="pi pi-eye text-xs"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShowroomDashboard;
