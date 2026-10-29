//
const Customer = require("../models/Customers");
const Installment = require("../models/Installment");
const Leads = require("../models/Leads");
const Showroom = require("../models/Showroom");
const Stocks = require("../models/Stocks");

exports.createCustomer = async (req, res, next) => {
  try {
    const { accountInfo, cardno, productInfo, showRoom } = req.body;
    const { leadId, status } = req.query;
    const { engine } = req.body.productInfo;

    const cashDue = accountInfo?.saleprice - accountInfo?.dpamount;
    const hireDue = accountInfo?.hireprice;

    // Crad No. Existing Check
    if (status !== "cash") {
      const existingCustomer = await Customer.findOne({
        cardno: cardno,
      });
      if (existingCustomer) {
        return res.status(409).json("Card No already exists");
      }
    }

    // Engine & Chassis Existing Check
    // const existingEngine = await Customer.findOne({
    //   "productInfo.engine": productInfo?.engine,
    // });
    // const existingChassis = await Customer.findOne({
    //   "productInfo.chassis": productInfo?.chassis,
    // });

    // if (existingEngine && existingChassis) {
    //   return res.status(409).json("Engine No and Chassis No already exists");
    // }

    const stockData = await Stocks.findOne({ engine: engine });
    if (!stockData) {
      return res.status(404).json("Stock with this engine not found");
    }

    const filterShowroom = await Showroom.findOne({ name: showRoom });

    if (filterShowroom) {
      const cashBalance = parseInt(filterShowroom.cashDue) + parseInt(cashDue);
      const hireBalance =
        parseInt(filterShowroom.percentDue) + parseInt(hireDue);

      filterShowroom.cashDue = cashBalance;
      filterShowroom.percentDue = hireBalance;
      await filterShowroom.save();
    }

    // Add customer
    const newCustomer = new Customer(req.body);
    await newCustomer.save();

    // const newCustomer = "";

    // Delete stock by engine
    await Stocks.findOneAndDelete({ engine: engine });

    // Delete from Leads
    await Leads.findByIdAndDelete(leadId);

    res.status(200).json({
      success: true,
      status: 200,
      message: "Leads Created",
      data: newCustomer,
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

exports.allCustomer = async (req, res, next) => {
  try {
    const cusData = req.params.status;
    const { showroom } = req.query;
    let cursor;
    console.log(showroom, cusData);

    if (showroom === "Head Office") {
      cursor = { "cardStatus.type": cusData };
    } else {
      cursor = { "cardStatus.type": cusData, showRoom: showroom };
    }

    const customers = await Customer.find(cursor);

    // Initialize an array to hold the updated customer data with installment information
    const updatedCustomerData = [];

    // Fetch installment data for each customer based on cardno
    for (let customer of customers) {
      const customerInstallments = await Installment.find({
        cardNo: customer.cardno,
      });
      let totalInstallmentAmount = 0;
      if (customerInstallments.length > 0) {
        totalInstallmentAmount = customerInstallments.reduce(
          (sum, installment) => {
            // Ensure the amount is a number before adding
            return sum + (parseFloat(installment.amount) || 0);
          },
          0
        );
      }
      // Add the installment data to the customer object
      updatedCustomerData.push({
        ...customer.toObject(),
        accountInfo: {
          ...customer.accountInfo,
          totalInstallmentAmount,
        },
        installments: customerInstallments,
        paidInstallmentCount: customerInstallments.length,
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "All Customer",
      data: updatedCustomerData,
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

exports.cardCustomer = async (req, res, next) => {
  try {
    const cusData = req.params.cardNo;

    const cursor = { cardno: cusData };
    const data = await Customer.findOne(cursor);

    res.status(200).json({
      success: true,
      status: 200,
      message: "Leads Created",
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

exports.seizedCustomer = async (req, res, next) => {
  try {
    const seizedData = req.body;
    const { cardNo } = req.params;

    const { type, date, staff, seizedCost, coments } = seizedData;
    // if (!type || !date || !staff || !seizedCost || !comments) {
    //   return res.status(400).send({ message: "All fields are required" });
    // }

    console.log(seizedData);

    // Find the user by username and update their links field
    const updatedUser = await Customer.findOneAndUpdate(
      { cardno: cardNo },
      {
        $set: {
          "cardStatus.type": type,
          "cardStatus.seizedDate": date,
          "cardStatus.staff": staff,
          "cardStatus.seizedCost": seizedCost,
          "cardStatus.coments": coments,
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "Customer not found" });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Leads Created",
      data: updatedUser,
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

exports.paidCustomer = async (req, res, next) => {
  const paidData = req.body;
  const { cardNo } = req.params;

  const { paidDate, staff, type, coments } = paidData;

  try {
    const updatedUser = await Customer.findOneAndUpdate(
      { cardno: cardNo },
      {
        $set: {
          "cardStatus.type": type,
          "cardStatus.paidDate": paidDate,
          "cardStatus.staff": staff,
          "cardStatus.coments": coments,
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "Customer not found" });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Leads Created",
      data: updatedUser,
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

exports.docUpdate = async (req, res, next) => {
  const paidData = req.body;
  const { cardNo } = req.params;

  const { staff, docStatus, docDate } = paidData;
  try {
    const updatedUser = await Customer.findOneAndUpdate(
      { cardno: cardNo },
      {
        $set: {
          "cardStatus.staff": staff,
          "cardStatus.docStatus": docStatus,
          "cardStatus.docDate": docDate,
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "Customer not found" });
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "Leads Created",
      data: updatedUser,
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
