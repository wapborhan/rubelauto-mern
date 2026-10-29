import { useEffect, useMemo } from "react";
import moment from "moment";
import { useGetSingleInstallmentQuery } from "../../../redux/feature/api/customerApi";

const CusAccountInfo = ({ singleCustomer }) => {
  const cardNo = singleCustomer?.cardno;
  const {
    data: singleInstallment,
    refetch,
    isLoading,
  } = useGetSingleInstallmentQuery(cardNo, {
    skip: !cardNo,
  });

  const salePrice = Number(singleCustomer?.accountInfo?.saleprice) || 0;
  const hirePrice = Number(singleCustomer?.accountInfo?.hireprice) || 0;
  const dpAmount = Number(singleCustomer?.accountInfo?.dpamount) || 0;
  const hireDue = Math.max(0, salePrice + hirePrice - dpAmount);

  useEffect(() => {
    if (cardNo) {
      refetch();
    }
  }, [cardNo, refetch]);

  const installments = useMemo(() => {
    return singleInstallment?.data || [];
  }, [singleInstallment]);

  const totalPaid = useMemo(() => {
    return installments.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );
  }, [installments]);

  const calculateRemainingDue = (rowIndex) => {
    const previousAmounts = installments
      .slice(0, rowIndex + 1)
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    return Math.max(0, hireDue - previousAmounts);
  };

  const remainingFinalDue = Math.max(0, hireDue - totalPaid);

  if (isLoading) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200 mt-5">
        <i className="pi pi-spin pi-spinner text-2xl text-blue-600 mb-2 block"></i>
        <p className="text-xs md:text-sm text-gray-500">
          কিস্তি জমার খতিয়ান লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden print:border print:border-gray-300 print:shadow-none print-break-inside-avoid">
      {/* Table Header Strip */}
      <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2 print:bg-gray-100 print:py-2 print:px-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs print:hidden">
            <i className="pi pi-history"></i>
          </span>
          <div>
            <h3 className="font-bold text-gray-800 text-sm md:text-base print:text-xs">
              কিস্তি জমার পূর্ণাঙ্গ খতিয়ান (Installment Payment Ledger)
            </h3>
            <p className="text-xs text-gray-500 print:hidden">
              সকল কিস্তির ভাউচার, গ্রহীতা ও অবশিষ্ট বকেয়ার হিসাব
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-semibold border border-blue-200 print:border-gray-400 print:text-black">
            মোট কিস্তি জমা: ৳ {totalPaid.toLocaleString()}
          </span>
          <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg font-semibold border border-amber-200 print:border-gray-400 print:text-black">
            বাকি বকেয়া: ৳ {remainingFinalDue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs md:text-sm print:text-[10px]">
          <thead>
            <tr className="bg-gray-100/70 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs print:bg-gray-200 print:text-black print:text-[10px]">
              <th className="py-2.5 px-3 text-center w-12 print:py-1.5 print:px-2">
                ক্রঃ
              </th>
              <th className="py-2.5 px-3 print:py-1.5 print:px-2">
                জমার তারিখ
              </th>
              <th className="py-2.5 px-3 print:py-1.5 print:px-2">
                রশিদ / ভাউচার নং
              </th>
              <th className="py-2.5 px-3 text-right print:py-1.5 print:px-2">
                জমা পরিমাণ (৳)
              </th>
              <th className="py-2.5 px-3 text-right print:py-1.5 print:px-2">
                অবশিষ্ট বকেয়া (৳)
              </th>
              <th className="py-2.5 px-3 print:py-1.5 print:px-2">
                আদায়কারী / গ্রহীতা
              </th>
              <th className="py-2.5 px-3 print:py-1.5 print:px-2">
                মন্তব্য
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 print:divide-gray-300">
            {installments.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-gray-400 print:py-4 print:text-gray-600"
                >
                  <i className="pi pi-inbox text-2xl mb-1 block print:hidden"></i>
                  এখনও পর্যন্ত কোনো কিস্তি জমা হয়নি
                </td>
              </tr>
            ) : (
              installments.map((ins, index) => {
                const remainingDue = calculateRemainingDue(index);
                return (
                  <tr
                    key={ins._id || index}
                    className="hover:bg-blue-50/30 odd:bg-white even:bg-gray-50/40 transition-colors print:even:bg-white"
                  >
                    <td className="py-2.5 px-3 text-center text-gray-500 font-mono text-xs print:py-1 print:px-2">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-gray-800 whitespace-nowrap print:py-1 print:px-2">
                      {ins?.date
                        ? moment(ins.date).format("DD-MMM-YYYY")
                        : "—"}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700 whitespace-nowrap print:text-black print:py-1 print:px-2">
                      {ins?.voucher || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-emerald-600 whitespace-nowrap print:text-black print:py-1 print:px-2">
                      ৳ {Number(ins?.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-gray-800 whitespace-nowrap print:py-1 print:px-2">
                      ৳ {remainingDue.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-gray-700 whitespace-nowrap print:py-1 print:px-2">
                      {ins?.receiver || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 text-xs print:text-[9px] print:py-1 print:px-2">
                      {ins?.coments || "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Footer with Summary */}
          {installments.length > 0 && (
            <tfoot className="bg-gray-100/90 border-t-2 border-gray-300 font-bold text-gray-800 text-xs md:text-sm print:bg-gray-100 print:text-[10px]">
              <tr>
                <td className="py-2.5 px-3 text-center print:py-1 print:px-2">
                  {installments.length}
                </td>
                <td
                  colSpan={2}
                  className="py-2.5 px-3 text-right font-semibold text-gray-600 print:py-1 print:px-2"
                >
                  সর্বমোট হিসাব:
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-600 font-extrabold whitespace-nowrap print:text-black print:py-1 print:px-2">
                  ৳ {totalPaid.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-amber-700 font-extrabold whitespace-nowrap print:text-black print:py-1 print:px-2">
                  ৳ {remainingFinalDue.toLocaleString()} (অবশিষ্ট)
                </td>
                <td
                  colSpan={2}
                  className="py-2.5 px-3 text-gray-400 font-normal print:py-1 print:px-2"
                ></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default CusAccountInfo;
