module.exports = (async function () {
  const { Schema } = require("mongoose");
  const { DB1 } = await require("../mongo");

  const UserSchema = new Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    birthdate: { type: Date, required: true },
    kind_document: { type: String, required: true },
    num_document: { type: String, required: true },
    vaccine: { type: Schema.Types.ObjectId, ref: "Vaccine" },
  });
  return DB1.model("User", UserSchema);
})();
