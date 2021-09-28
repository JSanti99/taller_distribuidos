const express = require("express");
const cors = require("cors");
require("dotenv").config();

const user = require("./routes/user");
const vaccine = require("./routes/vaccine");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", user);
app.use("/vaccine", vaccine);

require("./mongo");

app.listen(3000, () => {
  console.log("Server is up");
});
