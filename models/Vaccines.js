module.exports = module.exports = (async function () {
  const { Schema } = require("mongoose");
  const { DB2 } = await require("../mongo");

  const VaccineSchema = new Schema({
    manufacturer: { type: String, required: true },
    date: { type: Date, required: true },
    doc_vaccinator: { type: String, required: true },
    name_vaccinator: { type: String, required: true },
    ips: { type: String, required: true },
    lot: { type: String, required: true },
  });
  return DB2.model("Vaccine", VaccineSchema);
})();
