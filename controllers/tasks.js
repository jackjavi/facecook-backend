const crypto = require("crypto");
const Task = require("../models/Task");

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

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    tasks.forEach((task) => (task.pass = decrypt(task.pass)));
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const getSingleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id });
    if (!task) {
      res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    task.pass = decrypt(task.pass);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const addTask = async (req, res) => {
  try {
    req.body.pass = encrypt(req.body.pass);
    const task = await Task.create(req.body);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const modifyTask = async (req, res) => {
  try {
    if (req.body.pass) {
      req.body.pass = encrypt(req.body.pass);
    }
    const task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    task.pass = decrypt(task.pass);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id });
    if (!task) {
      res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    res.status(200).json({ task });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

module.exports = {
  getAllTasks,
  getSingleTask,
  addTask,
  modifyTask,
  deleteTask,
};
