const express = require("express");
const mongoose = require("mongoose");

let router = express.Router();

router
  .route("")
  .get(async (req, res) => {
    const User = await require("../models/User");
    if (!User) {
      res.status(503).json({ error: "Server error" });
      return;
    }
    try {
      res.status(200).json(await User.find({}));
    } catch (error) {
      res.status(503).json({ error: "Server error" });
    }
  })
  .post(async (req, res) => {
    const User = await require("../models/User");
    const { DB1 } = await require("../mongo");
    if (!User || !DB1) {
      res.status(503).json({ error: "Server error" });
      return;
    }
    const { name, lastname, birthdate, kind_document, num_document, vaccine } =
      req.body;
    const session = await DB1.startSession();
    session.startTransaction();
    try {
      const newUser = User({
        name,
        lastname,
        birthdate,
        kind_document,
        num_document,
        vaccine,
      }).save({ session });
      session.commitTransaction();
      session.endSession();

      newUser
        .then((x) => {
          res.status(200).json(x);
        })
        .catch((err) => {
          res.status(400).json({ err: true });
        });
    } catch (err) {
      res.status(503).json({ err });
      session.abortTransaction();
    } finally {
      session.endSession();
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const User = await require("../models/User");
    if (!User) {
      res.status(503).json({ error: "Server error" });
      return;
    }
    try {
      const _id = req.params.id;
      res.status(200).json(await User.findOne({ _id }));
    } catch (error) {
      res.status(503).json({ error: "Server error" });
    }
  })
  .put(async (req, res) => {
    const User = await require("../models/User");
    const { DB1 } = await require("../mongo");
    if (!User || !DB1) {
      res.status(503).json({ error: "Server error" });
      return;
    }
    let _id = req.params.id;
    console.log(_id);
    _id = mongoose.Types.ObjectId(_id);
    const { name, vaccine } = req.body;
    const session = await DB1.startSession();

    session.startTransaction({
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    });
    try {
      const user = await User.findOneAndUpdate({ _id }, { vaccine });
      await session.commitTransaction();

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  })
  .delete(async (req, res) => {
    const User = await require("../models/User");
    const { DB1 } = await require("../mongo");
    if (!User || !DB1) {
      res.status(503).json({ error: "Server error" });
      return;
    }
    let _id = req.params.id;
    _id = mongoose.Types.ObjectId(_id);
    const session = await DB1.startSession();

    session.startTransaction({
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    });
    try {
      const user = await User.findOneAndDelete({ _id });
      await session.commitTransaction();

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  });

module.exports = router;
