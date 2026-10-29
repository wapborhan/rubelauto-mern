/**
 * Customer Dues & Installment Dawa (দাবি) Calculations
 */

export const calculateCustomerDues = (sale) => {
  const accountInfo = sale?.accountInfo || {};
  const salePrice = Number(accountInfo?.saleprice) || 0;
  const hirePrice = Number(accountInfo?.hireprice) || 0;
  const dpAmount = Number(accountInfo?.dpamount) || 0;
  const totalInstallmentPaid = Number(accountInfo?.totalInstallmentAmount) || 0;
  const insAmount = Number(accountInfo?.insamount) || 0;
  const term = Number(accountInfo?.term) || 0;

  // Paid installments count (how many times installments were paid)
  const paidCount =
    sale?.paidInstallmentCount !== undefined
      ? Number(sale.paidInstallmentCount)
      : accountInfo?.paidInstallmentCount !== undefined
      ? Number(accountInfo.paidInstallmentCount)
      : Array.isArray(sale?.installments)
      ? sale.installments.length
      : insAmount > 0
      ? Math.floor(totalInstallmentPaid / insAmount)
      : 0;

  // Total Contract Price & Remaining Contract Due
  const totalPrice = salePrice + hirePrice;
  const totalContractDue = Math.max(
    0,
    totalPrice - dpAmount - totalInstallmentPaid
  );

  // Elapsed Months calculation from sale date
  let elapsedMonths = 0;
  if (sale?.saledate) {
    const saleDate = new Date(sale.saledate);
    const currentDate = new Date();

    elapsedMonths = (currentDate.getFullYear() - saleDate.getFullYear()) * 12;
    elapsedMonths -= saleDate.getMonth();
    elapsedMonths += currentDate.getMonth();

    if (currentDate.getDate() < saleDate.getDate()) {
      elapsedMonths--;
    }

    const daysDifference = Math.floor(
      (currentDate.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDifference > 30) {
      elapsedMonths++;
    }
  }

  elapsedMonths = Math.max(0, elapsedMonths);

  // Expected installments due up to current date (Dawa / কিস্তি বকেয়া)
  const cappedElapsedMonths = term > 0 ? Math.min(term, elapsedMonths) : elapsedMonths;
  const expectedTotalInstallmentDue = cappedElapsedMonths * insAmount;
  let installmentDue = expectedTotalInstallmentDue - totalInstallmentPaid;

  // Dawa cannot exceed total contract due or be negative if overpaid
  installmentDue = Math.max(0, Math.min(totalContractDue, installmentDue));

  // Advance amount if paid ahead of schedule
  const advanceAmount = Math.max(
    0,
    totalInstallmentPaid - expectedTotalInstallmentDue
  );

  // Number of due installments in Dawa
  const dueInstallmentCount =
    insAmount > 0 && installmentDue > 0
      ? Math.ceil(installmentDue / insAmount)
      : 0;

  const isTermExpired = term > 0 && elapsedMonths >= term;

  return {
    totalPrice,
    totalContractDue,
    elapsedMonths,
    cappedElapsedMonths,
    installmentDue,
    dueInstallmentCount,
    paidCount,
    totalInstallmentPaid,
    advanceAmount,
    isTermExpired,
    term,
    insAmount,
  };
};

export const calculateSummaryTotals = (customers = []) => {
  let totalContractDueSum = 0;
  let totalInstallmentDueSum = 0;
  let totalInstallmentPaidSum = 0;

  (customers || []).forEach((c) => {
    const { totalContractDue, installmentDue, totalInstallmentPaid } =
      calculateCustomerDues(c);
    totalContractDueSum += totalContractDue;
    totalInstallmentDueSum += installmentDue;
    totalInstallmentPaidSum += totalInstallmentPaid;
  });

  return {
    count: (customers || []).length,
    totalContractDueSum,
    totalInstallmentDueSum,
    totalInstallmentPaidSum,
  };
};
