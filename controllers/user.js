const Users = require("../models/Users");
var ObjectId = require("mongoose").Types.ObjectId;

exports.createUser = async (req, res, next) => {
  try {
    const user = req.body;

    const newUser = new Users(user);
    const data = await newUser.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "User Created Successfully",
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

exports.allUser = async (req, res, next) => {
  try {
    const data = await Users.find({});

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

exports.singleUser = async (req, res, next) => {
  try {
    const email = req.query.email;
    const filter = email
      ? { email: { $regex: new RegExp(`^${email.trim()}$`, "i") } }
      : {};

    const data = await Users.findOne(filter);

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

exports.updateUser = async (req, res, next) => {
  try {
    const email = req.query.email;
    const updateData = req.body;
    const {
      name,
      photo,
      mobile,
      showRoom,
      designation,
      address,
      bloodGroup,
      isUpdated,
    } = updateData;

    const filter = email
      ? { email: { $regex: new RegExp(`^${email.trim()}$`, "i") } }
      : {};

    const data = await Users.findOneAndUpdate(
      filter,
      {
        $set: {
          name: name,
          photo: photo,
          mobile: mobile,
          showRoom: showRoom,
          designation: designation,
          address: address,
          bloodGroup: bloodGroup,
          isUpdated: isUpdated,
        },
      },
      { new: true }
    );

    console.log(data);

    res.status(200).json({
      success: true,
      status: 200,
      message: "User Updated Successfully",
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
