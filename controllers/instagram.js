const Acc = require("../models/Instagram");

const getAllAccs = async (req, res) => {
  try {
    const accs = await Acc.find({});
    res.status(200).json(accs);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const getSingleAcc = async (req, res) => {
  try {
    const acc = await Acc.findOne({ _id: req.params.id });
    if (!acc) {
      res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    res.status(200).json(acc);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const addAcc = async (req, res) => {
  try {
    const acc = await Acc.create(req.body);

    res.status(200).json(acc);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const modifyAcc = async (req, res) => {
  try {
    const acc = await Acc.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!acc) {
      res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    res.status(200).json(acc);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const deleteAcc = async (req, res) => {
  try {
    const acc = await Acc.findOneAndDelete({ _id: req.params.id });
    if (!acc) {
      res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    res.status(200).json({ acc });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

module.exports = {
  getAllAccs,
  getSingleAcc,
  addAcc,
  modifyAcc,
  deleteAcc,
};
