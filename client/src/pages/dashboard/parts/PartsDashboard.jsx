import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useGetPartsPurchaseQuery } from "../../../redux/feature/api/purchaseApi";
import { useGetSupplierQuery } from "../../../redux/feature/api/supplierApi";
import { useGetIncomeQuery } from "../../../redux/feature/api/incomeApi";
import { useGetCostQuery } from "../../../redux/feature/api/costApi";

const PartsDashboard = () => {
  const { data: partsMemoData, isLoading: isMemosLoading } =
    useGetPartsPurchaseQuery();
  const { data: supplierData, isLoading: isSuppliersLoading } =
    useGetSupplierQuery();
  const { data: incomeData } = useGetIncomeQuery("Parts");
  const { data: costData } = useGetCostQuery("Parts");

  const [posMemoCount, setPosMemoCount] = useState(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("memos") || "[]");
      setPosMemoCount(Array.isArray(saved) ? saved.length : 0);
    } catch (e) {
      setPosMemoCount(0);
    }
  }, []);

  const partsMemos = useMemo(() => {
    return partsMemoData?.data || [];
  }, [partsMemoData]);

  const allSuppliers = useMemo(() => {
    return supplierData?.data || [];
  }, [supplierData]);

  // Filter only Parts suppliers
  const partsSuppliers = useMemo(() => {
    return allSuppliers.filter((s) => s.prodType === "Parts");
  }, [allSuppliers]);

  // Income & Cost data
  const incomes = incomeData?.data || [];
  const costs = costData?.data || [];

  // Summary Totals
  const metrics = useMemo(() => {
    const totalPurchaseAmount = partsMemos.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    let totalOpeningBalance = 0;
    let totalSupplierPurchase = 0;
    let totalSupplierPayment = 0;
    let totalSupplierDue = 0;

    partsSuppliers.forEach((s) => {
      totalOpeningBalance += Number(s.openingBalance) || 0;
      totalSupplierPurchase += Number(s.totalPurchase) || 0;
      totalSupplierPayment += Number(s.totalPayment) || 0;
      totalSupplierDue += Number(s.currentBalance) || 0;
    });

    const totalIncome = incomes.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );
    const totalCost = costs.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    return {
      totalPurchaseAmount,
      totalMemosCount: partsMemos.length,
      partsSuppliersCount: partsSuppliers.length,
      totalOpeningBalance,
      totalSupplierPurchase,
      totalSupplierPayment,
      totalSupplierDue,
      totalIncome,
      totalCost,
    };
  }, [partsMemos, partsSuppliers, incomes, costs]);

  // Recent 6 purchase memos sorted by date
  const recentMemos = useMemo(() => {
    return [...partsMemos]
      .sort((a, b) => {
        const dateA = new Date(a.memoDate || a.createdAt || 0);
        const dateB = new Date(b.memoDate || b.createdAt || 0);
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [partsMemos]);

  // Suppliers with highest outstanding balance
  const topDueSuppliers = useMemo(() => {
    return [...partsSuppliers]
      .filter((s) => Number(s.currentBalance) > 0)
      .sort(
        (a, b) =>
          (Number(b.currentBalance) || 0) - (Number(a.currentBalance) || 0)
      )
      .slice(0, 5);
  }, [partsSuppliers]);

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Parts Purchases Value */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                মোট পার্টস ক্রয় (Value)
              </p>
              <h3 className="text-2xl font-extrabold text-indigo-700 mt-1">
                {isMemosLoading ? (
                  "..."
                ) : (
                  `৳ ${metrics.totalPurchaseAmount.toLocaleString()}`
                )}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
              <i className="pi pi-box"></i>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">যন্ত্রাংশ ক্রয় মূল্য</span>
            <Link
              to="/purchase/parts/view"
              className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              মেমো বিবরণী <i className="pi pi-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>

        {/* Total Purchase Memos Count */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                মোট ক্রয় মেমো
              </p>
              <h3 className="text-2xl font-extrabold text-blue-600 mt-1">
                {isMemosLoading ? "..." : `${metrics.totalMemosCount} টি`}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
              <i className="pi pi-file"></i>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">নিবন্ধিত চালান সংখ্যা</span>
            <Link
              to="/purchase/parts/add"
              className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              নতুন এন্ট্রি <i className="pi pi-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>

        {/* Parts Suppliers Count */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                পার্টস সরবরাহকারী
              </p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                {isSuppliersLoading ? "..." : `${metrics.partsSuppliersCount} জন`}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <i className="pi pi-users"></i>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">নিবন্ধিত ভেন্ডর</span>
            <Link
              to="/contact/supplier/parts/view"
              className="font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
            >
              সাপ্লায়ার তালিকা <i className="pi pi-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>

        {/* Total Supplier Outstanding Balance Due */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                সাপ্লায়ার দেনা / বকেয়া
              </p>
              <h3 className="text-2xl font-extrabold text-red-600 mt-1">
                {isSuppliersLoading ? (
                  "..."
                ) : (
                  `৳ ${metrics.totalSupplierDue.toLocaleString()}`
                )}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl">
              <i className="pi pi-wallet"></i>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">পরিশোধযোগ্য বকেয়া</span>
            <Link
              to="/contact/supplier/parts/view"
              className="font-semibold text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              হিসাব দেখুন <i className="pi pi-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Secondary Metrics: Total Payment, Income, Cost, POS Memos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Payments Made to Suppliers */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-gray-500 font-medium">
              সাপ্লায়ার মোট পরিশোধ
            </p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              ৳ {metrics.totalSupplierPayment.toLocaleString()}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <i className="pi pi-check-circle text-sm"></i>
          </div>
        </div>

        {/* Parts Store Income */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-gray-500 font-medium">
              পার্টস আয় (Income)
            </p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              ৳ {metrics.totalIncome.toLocaleString()}
            </p>
          </div>
          <Link
            to="/account/income/view"
            className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
            title="পার্টস আয় দেখুন"
          >
            <i className="pi pi-arrow-down-left text-sm"></i>
          </Link>
        </div>

        {/* Parts Store Cost */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-gray-500 font-medium">
              পার্টস খরচ (Cost)
            </p>
            <p className="text-xl font-bold text-red-600 mt-0.5">
              ৳ {metrics.totalCost.toLocaleString()}
            </p>
          </div>
          <Link
            to="/account/cost/view"
            className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors"
            title="পার্টস খরচ দেখুন"
          >
            <i className="pi pi-arrow-up-right text-sm"></i>
          </Link>
        </div>

        {/* POS Memos Count */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs text-gray-500 font-medium">
              পিওএস ক্যাশ মেমো
            </p>
            <p className="text-xl font-bold text-indigo-700 mt-0.5">
              {posMemoCount} টি
            </p>
          </div>
          <Link
            to="/memo"
            className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors"
            title="ক্যাশ মেমো তৈরি করুন"
          >
            <i className="pi pi-receipt text-sm"></i>
          </Link>
        </div>
      </div>

      {/* 3. Quick Action Shortcuts Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          দ্রুত অ্যাকশন (Quick Actions)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* POS Memo */}
          <Link
            to="/memo"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-receipt text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              ক্যাশ মেমো (POS)
            </span>
          </Link>

          {/* Add Parts Purchase */}
          <Link
            to="/purchase/parts/add"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-cart-plus text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              নতুন পার্টস ক্রয়
            </span>
          </Link>

          {/* Add Supplier */}
          <Link
            to="/contact/supplier/add"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-user-plus text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              নতুন সরবরাহকারী
            </span>
          </Link>

          {/* View Memos */}
          <Link
            to="/purchase/parts/view"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-file-edit text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              মেমো তালিকা
            </span>
          </Link>

          {/* View Parts Suppliers */}
          <Link
            to="/contact/supplier/parts/view"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-users text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              সাপ্লায়ার খতিয়ান
            </span>
          </Link>

          {/* Add Cost */}
          <Link
            to="/account/cost/add"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-red-500 hover:bg-red-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <i className="pi pi-minus-circle text-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              দোকান খরচ এন্ট্রি
            </span>
          </Link>
        </div>
      </div>

      {/* 4. POS Feature Spotlight Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-xl p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl shrink-0 border border-white/20">
            <i className="pi pi-print text-blue-200"></i>
          </div>
          <div>
            <h3 className="font-bold text-base md:text-lg">
              খুচরা পার্টস বিক্রয় ও মেমো জেনারেটর (POS Cash Memo)
            </h3>
            <p className="text-xs md:text-sm text-blue-200 mt-0.5">
              দোকানের কাউন্টার থেকে তাত্ক্ষণিক খুচরা ক্যাশ মেমো প্রিন্ট ও PDF
              ডাউনলোড করুন
            </p>
          </div>
        </div>
        <Link
          to="/memo"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs md:text-sm rounded-lg shadow transition-colors"
        >
          <i className="pi pi-plus text-xs"></i>
          মেমো কাউন্টার ওপেন করুন
        </Link>
      </div>

      {/* 5. Dual Data Grid: Recent Memos & Top Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Parts Purchase Memos (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-sm md:text-base">
                সাম্প্রতিক পার্টস ক্রয় মেমো
              </h3>
              <p className="text-xs text-gray-500">
                সর্বশেষ চালানের তালিকা ও পরিমাণ
              </p>
            </div>
            <Link
              to="/purchase/parts/view"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
            >
              সকল মেমো <i className="pi pi-arrow-right text-[10px]"></i>
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs">
                  <th className="py-2.5 px-3 text-center w-10">ক্রঃ</th>
                  <th className="py-2.5 px-3">তারিখ</th>
                  <th className="py-2.5 px-3">মেমো নং</th>
                  <th className="py-2.5 px-3">সরবরাহকারী</th>
                  <th className="py-2.5 px-3">পরিবহন</th>
                  <th className="py-2.5 px-3 text-right">পরিমাণ</th>
                  <th className="py-2.5 px-3 text-center w-14">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentMemos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      কোনো পার্টস ক্রয় মেমো পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  recentMemos.map((memo, idx) => (
                    <tr
                      key={memo._id || idx}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center text-gray-500 font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 text-gray-700 whitespace-nowrap text-xs">
                        {memo.memoDate
                          ? moment(memo.memoDate).format("DD-MMM-YYYY")
                          : "—"}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {memo.MemoNo || "—"}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-900 whitespace-nowrap">
                        {memo.supplier?.bssName || "—"}
                      </td>
                      <td className="py-2.5 px-3 text-gray-600 text-xs whitespace-nowrap">
                        {memo.transport || "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-gray-900 whitespace-nowrap">
                        ৳ {Number(memo.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <Link
                          to="/purchase/parts/view"
                          className="p-1 text-blue-600 hover:text-blue-800 inline-block"
                          title="বিস্তারিত মেমো"
                        >
                          <i className="pi pi-eye text-xs"></i>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Top Due Suppliers (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-sm md:text-base">
                সরবরাহকারী বকেয়া দেনা
              </h3>
              <p className="text-xs text-gray-500">
                শীর্ষ বকেয়া পরিশোধ তালিকা
              </p>
            </div>
            <Link
              to="/contact/supplier/parts/view"
              className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 flex items-center gap-1 transition-colors"
            >
              সকল সরবরাহকারী <i className="pi pi-arrow-right text-[10px]"></i>
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs">
                  <th className="py-2.5 px-3">প্রতিষ্ঠান</th>
                  <th className="py-2.5 px-3 text-right">মোট ক্রয়</th>
                  <th className="py-2.5 px-3 text-right">বকেয়া দেনা</th>
                  <th className="py-2.5 px-3 text-center w-16">পরিশোধ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topDueSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      কোনো সরবরাহকারীর বকেয়া দেনা নেই
                    </td>
                  </tr>
                ) : (
                  topDueSuppliers.map((supplier, idx) => (
                    <tr
                      key={supplier._id || idx}
                      className="hover:bg-red-50/30 transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-gray-900">
                          {supplier.bssName}
                        </div>
                        {supplier.mobile && (
                          <div className="text-[11px] text-gray-500 font-mono">
                            {supplier.mobile}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-700 whitespace-nowrap">
                        ৳ {Number(supplier.totalPurchase || 0).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-red-600 whitespace-nowrap">
                        ৳ {Number(supplier.currentBalance || 0).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <Link
                          to={`/contact/supplier/payment/${supplier._id}`}
                          className="px-2 py-1 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 rounded transition-colors inline-block"
                          title="টাকা পরিশোধ করুন"
                        >
                          পেমেন্ট
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartsDashboard;
