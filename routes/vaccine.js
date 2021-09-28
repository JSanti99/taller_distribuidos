const express = require("express");
const mongoose = require("mongoose");

let router = express.Router();

router
  .route("")
  .get(async (req, res) => {
    const Vaccine = await require("../models/Vaccines");
    if (!Vaccine) {
      res.status(503).json({ error: "Server error" });
      return;
    }
    try {
      res.status(200).json(await Vaccine.find({}));
    } catch (error) {
      res.status(503).json({ error: "Server error" });
    }
  })
  .post(async (req, res) => {
    const Vaccine = await require("../models/Vaccines");
    const { DB2 } = await require("../mongo");
    if (!Vaccine || !DB2) {
      res.status(503).json({ error: "Server error" });
      return;
    }
    const { manufacturer, date, doc_vaccinator, name_vaccinator, ips, lot } =
      req.body;
    const session = await DB2.startSession();
    session.startTransaction();
    try {
      const vaccine = Vaccine({
        manufacturer,
        date,
        doc_vaccinator,
        name_vaccinator,
        ips,
        lot,
      }).save({ session });
      // console.log({ vaccine });
      await session.commitTransaction();
      session.endSession();

      vaccine
        .then((x) => {
          res.status(200).json(x);
        })
        .catch((err) => {
          res.status(400).json({ err: true });
        });
    } catch (err) {
      res.status(503).json({ err });
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const Vaccine = await require("../models/Vaccines");
    if (!Vaccine) {
      res.status(503).json({ error: "Server error" });
      return;
    }
    try {
      const _id = req.params.id;
      res.status(200).json(await Vaccine.findOne({ _id }));
    } catch (error) {
      res.status(503).json({ error: "Server error" });
    }
  })
  .put(async (req, res) => {
    const Vaccine = await require("../models/Vaccines");
    const { DB2 } = await require("../mongo");
    if (!Vaccine || !DB2) {
      res.status(503).json({ error: "Server error" });
      return;
    }
    let _id = req.params.id;
    _id = mongoose.Types.ObjectId(_id);
    const { manufacturer } = req.body;
    const session = await DB2.startSession();

    session.startTransaction({
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    });
    try {
      const vaccine = await Vaccine.findOneAndUpdate({ _id }, { manufacturer });
      await session.commitTransaction();

      res.status(200).json(vaccine);
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  })
  .delete(async (req, res) => {
    const Vaccine = await require("../models/Vaccines");
    const { DB2 } = await require("../mongo");
    if (!Vaccine || !DB2) {
      res.status(503).json({ error: "Server error" });
      return;
    }
    let _id = req.params.id;
    _id = mongoose.Types.ObjectId(_id);
    const session = await DB2.startSession();

    session.startTransaction({
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    });
    try {
      const vaccine = await Vaccine.findOneAndDelete({ _id });
      await session.commitTransaction();

      res.status(200).json(vaccine);
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      res.status(503).json({ error: true });
    } finally {
      session.endSession();
    }
  });

module.exports = router;
