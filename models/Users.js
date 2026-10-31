const { model, Schema, mongoose } = require("mongoose");

const usersSchema = new Schema(
  {
    joinDate: { type: Date, default: Date.now },
    name: { type: String, trim: true },
    photo: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String },
    showRoom: { type: String },
    designation: { type: String },
    bloodGroup: { type: String },
    address: { type: String },
    userType: { type: String, default: "user" },
    isUpdated: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true, collection: "users" }
);

const Users = mongoose.models.users || model("users", usersSchema, "users");

module.exports = Users;
