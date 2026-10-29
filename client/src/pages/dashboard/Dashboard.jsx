import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import ShowroomDashboard from "./showroom/ShowroomDashboard";
import PartsDashboard from "./parts/PartsDashboard";

const Dashboard = () => {
  const { showRoom, name, designation } = useSelector(
    (state) => state.userStore
  );

  // If user belongs to Parts showroom, default to parts tab; otherwise showroom
  const [activeTab, setActiveTab] = useState(
    showRoom === "Parts" ? "parts" : "showroom"
  );

  useEffect(() => {
    if (showRoom === "Parts") {
      setActiveTab("parts");
    } else {
      setActiveTab("showroom");
    }
  }, [showRoom]);

  return (
    <div className="w-full mx-auto space-y-6">
      {/* 1. Executive Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-5 md:p-6 shadow-md border border-slate-800 relative overflow-hidden">
        {/* Ambient Decorative Lighting */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-36 -top-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                শোরুম: {showRoom || "প্রধান কার্যালয়"}
              </span>
              {designation && (
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/10">
                  {designation}
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              স্বাগতম, {name || "ব্যবহারকারী"}! 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              রুবেল অটোমোবাইলস সেন্ট্রাল ইআরপি — মোটরসাইকেল বিক্রি, কিস্তি বকেয়া,
              পার্টস স্টক ও আর্থিক সারসংক্ষেপ
            </p>
          </div>

          {/* Date & POS Quick Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 text-slate-200">
              <i className="pi pi-calendar text-blue-300"></i>
              <span>{moment().format("dddd, DD MMMM YYYY")}</span>
            </div>
            <Link
              to="/memo"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
            >
              <i className="pi pi-receipt text-xs"></i>
              <span>ক্যাশ মেমো (POS)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Dashboard View Switcher Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        {/* Segmented Switcher Tabs */}
        <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("showroom")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
              activeTab === "showroom"
                ? "bg-white text-blue-700 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
            }`}
          >
            <i className="pi pi-building text-xs"></i>
            <span>মোটরসাইকেল শোরুম ড্যাশবোর্ড</span>
            {activeTab === "showroom" && (
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("parts")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
              activeTab === "parts"
                ? "bg-white text-indigo-700 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
            }`}
          >
            <i className="pi pi-cog text-xs"></i>
            <span>যন্ত্রাংশ ও পার্টস ড্যাশবোর্ড</span>
            {activeTab === "parts" && (
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            )}
          </button>
        </div>

        {/* View Indicator */}
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            লাইভ রিয়েল-টাইম তথ্য
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-600">
            ভিউ:{" "}
            <strong className="text-gray-800">
              {activeTab === "showroom"
                ? "মোটরসাইকেল শোরুম"
                : "যন্ত্রাংশ ও পার্টস"}
            </strong>
          </span>
        </div>
      </div>

      {/* 3. Active Dashboard View */}
      <div className="transition-all duration-200">
        {activeTab === "showroom" ? <ShowroomDashboard /> : <PartsDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
