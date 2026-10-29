import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCustomerQuery } from "../../redux/feature/api/customerApi";
import CustomerTableHeader from "./CustomerTableHeader";
import CustomerTable from "./CustomerTable";

export default function Customer() {
  const { status } = useParams();
  const path = status || "running";

  const { showRoom } = useSelector((state) => state.userStore);
  const {
    data: customers,
    refetch,
    isLoading,
  } = useGetCustomerQuery({ path, showRoom });

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [instFromDay, setInstFromDay] = useState(null);
  const [instToDay, setInstToDay] = useState(null);
  const [showRoomFilter, setShowRoomFilter] = useState(null);

  useEffect(() => {
    refetch();
  }, [path, refetch]);

  const rawList = customers?.data || [];

  const uniqueShowRooms = useMemo(() => {
    return [...new Set(rawList.map((c) => c.showRoom))].filter(Boolean);
  }, [rawList]);

  const filteredData = useMemo(() => {
    return rawList.filter((item) => {
      // Search Term Filter
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const name = (item.customerInfo?.name || "").toLowerCase();
        const cardno = String(item.cardno || "").toLowerCase();
        const phone = String(item.customerInfo?.number || "").toLowerCase();
        const model = (item.productInfo?.models || item.productInfo?.type || "").toLowerCase();
        const showroom = (item.showRoom || "").toLowerCase();

        if (
          !name.includes(q) &&
          !cardno.includes(q) &&
          !phone.includes(q) &&
          !model.includes(q) &&
          !showroom.includes(q)
        ) {
          return false;
        }
      }

      const saleDate = item.saledate ? new Date(item.saledate) : null;
      const installmentDate = item?.accountInfo?.insdate
        ? new Date(item.accountInfo.insdate)
        : null;

      // Sale Date Range Filter
      if (fromDate && saleDate) {
        const fDate = new Date(fromDate);
        fDate.setHours(0, 0, 0, 0);
        if (saleDate < fDate) return false;
      }
      if (toDate && saleDate) {
        const tDate = new Date(toDate);
        tDate.setHours(23, 59, 59, 999);
        if (saleDate > tDate) return false;
      }

      // Installment Day Number Filter (1–31)
      if ((instFromDay || instToDay) && installmentDate) {
        const day = installmentDate.getDate();
        const from = instFromDay || 1;
        const to = instToDay || 31;
        if (day < from || day > to) return false;
      }

      // Showroom Filter
      if (showRoomFilter && item.showRoom !== showRoomFilter) {
        return false;
      }

      return true;
    });
  }, [rawList, searchTerm, fromDate, toDate, instFromDay, instToDay, showRoomFilter]);

  const hasActiveFilters = Boolean(
    searchTerm || showRoomFilter || fromDate || toDate || instFromDay || instToDay
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setShowRoomFilter(null);
    setFromDate(null);
    setToDate(null);
    setInstFromDay(null);
    setInstToDay(null);
  };

  return (
    <div className="w-full mx-auto space-y-0">
      <CustomerTableHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showRoomFilter={showRoomFilter}
        setShowRoomFilter={setShowRoomFilter}
        uniqueShowRooms={uniqueShowRooms}
        instFromDay={instFromDay}
        setInstFromDay={setInstFromDay}
        instToDay={instToDay}
        setInstToDay={setInstToDay}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        filteredData={filteredData}
        totalCount={rawList.length}
      />
      <CustomerTable
        data={filteredData}
        path={path}
        isLoading={isLoading}
      />
    </div>
  );
}
