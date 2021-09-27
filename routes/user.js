const express = require("express");
const { User } = require("../models/User");
const { DB1 } = require("../mongo");
const mongoose = require("mongoose");
let router = express.Router();

router
  .route("")
  .get(async (req, res) => {
    try {
      res.status(200).json(await User.find({}));
    } catch (error) {
      res.status(503).json({ error: "Server error" });
    }
  })
  .post(async (req, res) => {
    const { name } = req.body;
    const session = await DB1.startSession();
    session.startTransaction();
    try {
      const newUser = User({ name }).save({ session });
      session.commitTransaction();
      session.endSession();

      res.status(200).json({ ok: true });
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
    try {
      const _id = req.params.id;
      res.status(200).json(await User.findOne({ _id }));
    } catch (error) {
      res.status(503).json({ error: "Server error" });
    }
  })
  .put(async (req, res) => {
    let _id = req.params.id;
    console.log(_id);
    _id = mongoose.Types.ObjectId(_id);
    const { name, vaccine } = req.body;
    const session = await DB1.startSession();
    try {
      session.startTransaction();

      const user = await User.updateOne(
        { _id },
        {
          name,
          vaccine,
        }
      ).session(session);
      console.log(user);

      await session.commitTransaction();

      console.log("success");
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
    }
    session.endSession();
  })
  .delete(async () => {});

module.exports = router;
