const crypto = require("crypto");
const Task = require("../models/Task");

const algorithm = "aes-256-cbc";
const secretKey = "transpoll";

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

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    tasks.forEach((task) => {
      if (task.pass) {
        task.pass = decrypt(task.pass);
      }
    });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getSingleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id });
    if (!task) {
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    if (task.pass) {
      task.pass = decrypt(task.pass);
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const addTask = async (req, res) => {
  try {
    if (req.body.pass) {
      req.body.pass = encrypt(req.body.pass);
    }
    const task = await Task.create(req.body);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
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
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    if (task.pass) {
      task.pass = decrypt(task.pass);
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id });
    if (!task) {
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    res.status(200).json({ task });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getAllTasks,
  getSingleTask,
  addTask,
  modifyTask,
  deleteTask,
};
