// users schema
const { Schema } = require("mongoose");
const { DB1 } = require("../mongo");

const UserSchema = new Schema({
  name: { type: String, required: true },
  vaccine: { type: Schema.Types.ObjectId, ref: "Vaccine" },
});

module.exports.User = DB1.model("User", UserSchema);
