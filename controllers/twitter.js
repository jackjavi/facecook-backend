const crypto = require("crypto");
const Acc = require("../models/Twitter");

const algorithm = "aes-256-cbc";
const secretKey = "transpoll";
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

const decrypt = (text) => {
  const [ivHex, encryptedText] = text.split(":");
  const ivBuffer = Buffer.from(ivHex, "hex");
  const encryptedBuffer = Buffer.from(encryptedText, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    ivBuffer
  );
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const getAllAccs = async (req, res) => {
  try {
    const accs = await Acc.find({});
    accs.forEach((acc) => (acc.pass = decrypt(acc.pass)));
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
    acc.pass = decrypt(acc.pass);
    res.status(200).json(acc);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const addAcc = async (req, res) => {
  try {
    req.body.pass = encrypt(req.body.pass);
    const acc = await Acc.create(req.body);
    res.status(200).json(acc);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const modifyAcc = async (req, res) => {
  try {
    if (req.body.pass) {
      req.body.pass = encrypt(req.body.pass);
    }
    const acc = await Acc.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!acc) {
      res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    acc.pass = decrypt(acc.pass);
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
