import moment from "moment";
import { useGetSupplierStatementQuery } from "../../redux/feature/api/supplierApi";
import Loading from "../../components/shared/Loading";

const SupplierDetailPur = ({ supplierId }) => {
  const { data, isLoading, isError } = useGetSupplierStatementQuery(supplierId);

  const transactions = data?.transactions || [];
  const openingBalance = Number(data?.supplier?.openingBalance || 0);
  const debitTotal = Number(data?.statement?.debitTotal || 0);
  const creditTotal = Number(data?.statement?.creditTotal || 0);
  const netAmount = Number(data?.statement?.netAmount || 0);

  return (
    <fieldset className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 md:p-7 print:border-gray-300 overflow-hidden">
      <legend className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-200 text-xs md:text-sm">
        স্টেটমেন্ট (Statement)
      </legend>

      {isLoading ? (
        <div className="py-10 text-center">
          <Loading />
          <p className="text-xs text-gray-500 mt-2">স্টেটমেন্ট লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="overflow-x-auto my-2 border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100/90 border-b border-gray-300 text-gray-700 font-semibold text-xs tracking-wider">
                <th className="py-3 px-3.5 border-r border-gray-200 text-center w-28">
                  Date
                </th>
                <th className="py-3 px-3.5 border-r border-gray-200 w-36">
                  Reference
                </th>
                <th className="py-3 px-3.5 border-r border-gray-200">
                  Description
                </th>
                <th className="py-3 px-3.5 border-r border-gray-200 text-right w-36">
                  Debit (Purchase)
                </th>
                <th className="py-3 px-3.5 border-r border-gray-200 text-right w-36">
                  Credit (Payment)
                </th>
                <th className="py-3 px-3.5 text-right w-36">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Opening Balance Row */}
              <tr className="bg-blue-50/40 text-gray-800 font-medium">
                <td colSpan={3} className="py-2.5 px-3.5 border-r border-gray-200 font-bold text-gray-700">
                  Opening Balance (প্রারম্ভিক ব্যালেন্স)
                </td>
                <td className="py-2.5 px-3.5 border-r border-gray-200 text-right text-gray-400">
                  —
                </td>
                <td className="py-2.5 px-3.5 border-r border-gray-200 text-right text-gray-400">
                  —
                </td>
                <td className="py-2.5 px-3.5 text-right font-extrabold text-gray-900">
                  ৳ {openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Transactions Rows */}
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                    কোনো লেনদেনের রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                transactions.map((t, i) => (
                  <tr
                    key={i}
                    className="hover:bg-blue-50/30 odd:bg-white even:bg-gray-50/40 transition-colors"
                  >
                    <td className="py-2.5 px-3.5 border-r border-gray-200 text-center text-gray-700 whitespace-nowrap font-mono text-xs">
                      {t.date ? moment(t.date).format("DD-MM-YYYY") : "—"}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-gray-200 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {t.refNo || "—"}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-gray-200 text-gray-800">
                      {t.description || "—"}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-gray-200 text-right font-semibold text-gray-900 whitespace-nowrap">
                      {t.debit > 0
                        ? `৳ ${Number(t.debit).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : "—"}
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-gray-200 text-right font-semibold text-emerald-600 whitespace-nowrap">
                      {t.credit > 0
                        ? `৳ ${Number(t.credit).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : "—"}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-extrabold text-gray-900 whitespace-nowrap">
                      ৳ {Number(t.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Totals Footer Row */}
            <tfoot className="bg-gray-100 font-bold border-t-2 border-gray-300 text-gray-900 text-xs md:text-sm">
              <tr>
                <td colSpan={3} className="py-3 px-3.5 border-r border-gray-300 text-right uppercase tracking-wider">
                  Totals
                </td>
                <td className="py-3 px-3.5 border-r border-gray-300 text-right text-gray-900 whitespace-nowrap">
                  ৳ {debitTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-3.5 border-r border-gray-300 text-right text-emerald-700 whitespace-nowrap">
                  ৳ {creditTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-3.5 text-right text-red-600 font-extrabold whitespace-nowrap">
                  ৳ {netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {isError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-xs">
          স্টেটমেন্টের ডাটা লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।
        </div>
      )}
    </fieldset>
  );
};

export default SupplierDetailPur;
