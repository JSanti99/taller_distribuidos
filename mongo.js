const mongoose = require("mongoose");
const axios = require("axios").default;

module.exports = (async function () {
  //some async initiallizers
  //e.g. await the db module that has the same structure like this
  var { mongoDB1, mongoDB2 } = (
    await axios("http://6583-181-51-44-87.ngrok.io/config.json")
  ).data;
  let DB1 = mongoose.createConnection(mongoDB1, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false,
    // server: { reconnectTries: Number.MAX_VALUE },
  });
  let DB2 = mongoose.createConnection(mongoDB2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false,
    // server: { reconnectTries: Number.MAX_VALUE },
  });
  mongoose.connections.map((con, i) => {
    con
      .once("open", () => console.log("connected db #", i))
      .on("error", (error) =>
        console.log(`NOT connected db #${i} , ERROR --> ${error}`)
      );
  });
  return {
    DB1,
    DB2,
  };
})();
