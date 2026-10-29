const Leads = require("../models/Leads");
var ObjectId = require("mongoose").Types.ObjectId;

exports.createLead = async (req, res, next) => {
  try {
    const leadData = req.body;

    const newLead = new Leads(leadData);
    const data = await newLead.save();

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

exports.allLead = async (req, res, next) => {
  try {
    const data = await Leads.find();
    res.status(200).json({
      success: true,
      status: 200,
      message: "Leads Found",
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

exports.singleLead = async (req, res, next) => {
  try {
    const leadId = req.params.id;

    const cursor = { _id: new ObjectId(leadId) };
    const data = await Leads.findOne(cursor);

    res.status(200).json({
      success: true,
      status: 200,
      message: "Users Found",
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

exports.updateLead = async (req, res, next) => {
  try {
    const leadData = req.body;
    const id = req.params.id;

    const { name, coname, nid, address, number, location, media, status, guarantor } = leadData;

    const updateFields = {
      name,
      coname,
      nid,
      address,
      number,
      location,
      media,
    };
    if (status !== undefined) updateFields.status = status;
    if (guarantor !== undefined) updateFields.guarantor = guarantor;

    const updatedLead = await Leads.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { new: true }
    );
    if (!updatedLead) {
      return res.status(404).send({ message: "Customer not found" });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Lead Updated",
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

exports.addGuarantor = async (req, res, next) => {
  try {
    const leadData = req.body;
    const id = req.params.id;

    const query = { _id: new ObjectId(id) };
    const updateDoc = {
      $push: { guarantor: leadData },
    };

    const data = await Leads.updateOne(query, updateDoc);

    res.status(200).json({
      success: true,
      status: 200,
      message: "Users Found",
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
