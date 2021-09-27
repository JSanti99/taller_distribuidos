// vaccines schema
const { Schema } = require("mongoose");
const { DB2 } = require("../mongo");

const VaccineSchema = new Schema({
  manufacturer: { type: String, required: true },
});

module.exports.Vaccine = DB2.model("Vaccine", VaccineSchema);
