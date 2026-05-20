const Supliers = require("../models/Supplier");
const PartsPurchase = require("../models/PartsPurchase");
const SuplierPayment = require("../models/SuplierPayment");

var ObjectId = require("mongoose").Types.ObjectId;

exports.createSupplier = async (req, res, next) => {
  try {
    const suplierData = req.body;

    const saveSuplier = new Supliers(suplierData);
    const data = await saveSuplier.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Supplier Found",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
      data: {},
    });
  }
};

exports.allSupplier = async (req, res, next) => {
  try {
    const suppliers = await Supliers.find({});

    // Calculate totals for each supplier
    const enrichedSuppliers = await Promise.all(
      suppliers.map(async (supplier) => {
        const supplierId = supplier._id.toString();

        // Total Purchases
        const purchasesAgg = await PartsPurchase.aggregate([
          { $match: { supplierId } },
          { $group: { _id: null, totalPurchase: { $sum: "$amount" } } },
        ]);
        const totalPurchase =
          purchasesAgg.length > 0 ? purchasesAgg[0].totalPurchase : 0;

        // Total Payments
        const paymentsAgg = await SuplierPayment.aggregate([
          { $match: { supplierId } },
          { $group: { _id: null, totalPayment: { $sum: "$amount" } } },
        ]);

        console.log(purchasesAgg);

        const totalPayment =
          paymentsAgg.length > 0 ? paymentsAgg[0].totalPayment : 0;

        // Current Balance
        const currentBalance =
          (supplier.openingBalance || 0) + totalPurchase - totalPayment;

        return {
          ...supplier.toObject(),
          totalPurchase,
          totalPayment,
          currentBalance,
        };
      }),
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: "Suppliers Found",
      data: enrichedSuppliers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
      data: {},
    });
  }
};

exports.singleSupplier = async (req, res, next) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };

    // Find supplier info
    const supplier = await Supliers.findOne(filter);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Supplier not found",
        data: {},
      });
    }

    // Total Purchases
    const purchasesAgg = await PartsPurchase.aggregate([
      { $match: { supplierId: id } },
      { $group: { _id: null, totalPurchase: { $sum: "$amount" } } },
    ]);

    const totalPurchase =
      purchasesAgg.length > 0 ? purchasesAgg[0].totalPurchase : 0;

    // Total Payments
    const paymentsAgg = await SuplierPayment.aggregate([
      { $match: { supplierId: id } },
      { $group: { _id: null, totalPayment: { $sum: "$amount" } } },
    ]);

    const totalPayment =
      paymentsAgg.length > 0 ? paymentsAgg[0].totalPayment : 0;

    // Current Balance = OpeningBalance + Purchases - Payments
    const currentBalance =
      (supplier.openingBalance || 0) + totalPurchase - totalPayment;

    res.status(200).json({
      success: true,
      status: 200,
      message: "Supplier Found",
      data: {
        ...supplier.toObject(),
        totalPurchase,
        totalPayment,
        currentBalance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
      data: {},
    });
  }
};

exports.updateSupplier = async (req, res, next) => {
  try {
    const suplierData = req.body;
    const id = req.params.id;

    const {
      openingBalance,
      bssName,
      empName,
      prodType,
      email,
      mobile,
      address,
    } = suplierData;

    const updatedLead = await Supliers.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          openingBalance: openingBalance,
          bssName: bssName,
          empName: empName,
          prodType: prodType,
          email: email,
          mobile: mobile,
          address: address,
        },
      },
      { new: true },
    );
    if (!updatedLead) {
      return res.status(404).send({ message: "Supplier not found" });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Supplier Updated",
      data: updatedLead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
      data: {},
    });
  }
};

exports.paymentSupplier = async (req, res, next) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const suplier = await Supliers.findOne(filter);

    if (!suplier) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Supplier not found",
        data: {},
      });
    }
    const suplierData = req.body;

    const saveSuplier = new SuplierPayment(suplierData);
    const data = await saveSuplier.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Supplier Payment Successfully.",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
      data: {},
    });
  }
};

exports.supplierStatement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const filter = { _id: new ObjectId(id) };

    const supplier = await Supliers.findById(filter);
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });

    const purchases = await PartsPurchase.find({ supplierId: id }).lean();

    const payments = await SuplierPayment.find({ supplierId: id }).lean();
    // map purchases as debit
    const debitTx = purchases.map((p) => ({
      type: "debit",
      date: p.memoDate,
      refNo: p.memoNo,
      description: p.notes || "Purchase",
      debit: p.amount,
      credit: 0,
    }));

    // map payments as credit
    const creditTx = payments.map((pay) => ({
      type: "credit",
      date: pay.paymentDate,
      refNo: pay.paymentNo,
      description: pay.notes || "Payment",
      debit: 0,
      credit: pay.amount,
    }));

    // merge + sort by date
    const allTx = [...debitTx, ...creditTx].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    // running balance calculation
    let balance = supplier.openingBalance || 0;
    const transactionsWithBalance = allTx.map((t) => {
      if (t.type === "debit") balance += t.debit;
      if (t.type === "credit") balance -= t.credit;

      return {
        ...t,
        balance, // add running balance after this transaction
      };
    });

    // totals
    const debitTotal = transactionsWithBalance.reduce(
      (sum, t) => sum + t.debit,
      0,
    );
    const creditTotal = transactionsWithBalance.reduce(
      (sum, t) => sum + t.credit,
      0,
    );

    res.json({
      supplier,
      statement: {
        debitTotal,
        creditTotal,
        netAmount: balance, // final balance after all tx
      },
      transactions: transactionsWithBalance,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
