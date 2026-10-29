const { model, Schema, mongoose } = require("mongoose");

const usersSchema = new Schema(
  {
    joinDate: { type: Date },
    name: { type: String },
    photo: { type: String },
    email: { type: String },
    mobile: { type: String },
    showRoom: { type: String },
    designation: { type: String },
    bloodGroup: { type: String },
    address: { type: String },
    userType: { type: String },
    isUpdated: { type: Boolean },
  },
  { versionKey: false, timestamps: true, collection: "users" }
);

const Users = mongoose.models.users || model("users", usersSchema, "users");

module.exports = Users;
