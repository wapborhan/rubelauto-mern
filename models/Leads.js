const { model, Schema } = require("mongoose");

const leadSchema = new Schema(
  {
    status: { type: String },
    name: { type: String },
    coname: { type: String },
    nid: { type: String },
    address: { type: Schema.Types.Mixed },
    number: { type: String },
    location: { type: String },
    media: { type: String },
    guarantor: { type: Array },
  },
  { versionKey: false }
);

const Leads = model("leads", leadSchema);

module.exports = Leads;
