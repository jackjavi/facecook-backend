const crypto = require("crypto");
const Acc = require("../models/Twitter");

const algorithm = "aes-256-cbc";
const secretKey = crypto
  .createHash("sha256")
  .update("transpoll")
  .digest("base64")
  .substr(0, 32);

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

const decrypt = (text) => {
  const [ivHex, encryptedText] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const getAllAccs = async (req, res) => {
  try {
    const accs = await Acc.find({});
    accs.forEach((acc) => {
      if (acc.pass) {
        acc.pass = decrypt(acc.pass);
      }
    });
    res.status(200).json(accs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getSingleAcc = async (req, res) => {
  try {
    const acc = await Acc.findOne({ _id: req.params.id });
    if (!acc) {
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    if (acc.pass) {
      acc.pass = decrypt(acc.pass);
    }
    res.status(200).json(acc);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const addAcc = async (req, res) => {
  try {
    if (req.body.pass) {
      req.body.pass = encrypt(req.body.pass);
    }
    const acc = await Acc.create(req.body);
    res.status(200).json(acc);
  } catch (err) {
    res.status(500).json({ msg: err.message });
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
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    if (acc.pass) {
      acc.pass = decrypt(acc.pass);
    }
    res.status(200).json(acc);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteAcc = async (req, res) => {
  try {
    const acc = await Acc.findOneAndDelete({ _id: req.params.id });
    if (!acc) {
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    res.status(200).json({ acc });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getAllAccs,
  getSingleAcc,
  addAcc,
  modifyAcc,
  deleteAcc,
};
