const mongoose = require("mongoose");

const DB1 = mongoose.createConnection(process.env.connectionStringBD1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: false,
});
const DB2 = mongoose.createConnection(process.env.connectionStringBD2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: false,
});

mongoose.connections.map((con, i) => {
  con
    .once("open", () => console.log("connected db #", i))
    .on("error", (error) =>
      console.log(`NOT connected db #${i} , ERROR --> ${error}`)
    );
});

module.exports = {
  DB1,
  DB2,
};
