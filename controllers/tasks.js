const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "tasks.json");

// Helper function to read data from the JSON file
const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper function to write data to the JSON file
const writeDataToFile = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

const getAllTasks = (req, res) => {
  try {
    const tasks = readDataFromFile();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const getSingleTask = (req, res) => {
  try {
    const tasks = readDataFromFile();
    const task = tasks.find((task) => task._id === req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const addTask = (req, res) => {
  try {
    const tasks = readDataFromFile();
    const newTask = { _id: String(Date.now()), ...req.body };
    tasks.push(newTask);
    writeDataToFile(tasks);
    res.status(200).json(newTask);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const modifyTask = (req, res) => {
  try {
    const tasks = readDataFromFile();
    const index = tasks.findIndex((task) => task._id === req.params.id);
    if (index === -1) {
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    tasks[index] = { ...tasks[index], ...req.body };
    writeDataToFile(tasks);
    res.status(200).json(tasks[index]);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const deleteTask = (req, res) => {
  try {
    const tasks = readDataFromFile();
    const index = tasks.findIndex((task) => task._id === req.params.id);
    if (index === -1) {
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any taskID` });
    }
    const deletedTask = tasks.splice(index, 1);
    writeDataToFile(tasks);
    res.status(200).json({ task: deletedTask });
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
