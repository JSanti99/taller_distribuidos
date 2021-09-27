const express = require("express");
const { DB2 } = require("../mongo");
const { Vaccine } = require("../models/Vaccines");

let router = express.Router();

router
  .route("")
  .get(async (req, res) => {
    try {
      res.status(200).json(await Vaccine.find({}));
    } catch (error) {
      res.status(503).json({ error: "Server error" });
    }
  })
  .post(async (req, res) => {
    const { manufacturer } = req.body;
    const session = await DB2.startSession();
    session.startTransaction();
    try {
      Vaccine({ manufacturer }).save({ session });

      session.commitTransaction();
      session.endSession();

      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(503).json({ err });
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  });

router
  .route("/:id")
  .get(() => {})
  .delete(() => {});

module.exports = router;
