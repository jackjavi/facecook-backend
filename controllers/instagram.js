const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "instagramAccs.json");

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

const getAllAccs = (req, res) => {
  try {
    const accs = readDataFromFile();
    res.status(200).json(accs);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const getSingleAcc = (req, res) => {
  try {
    const accs = readDataFromFile();
    const acc = accs.find((acc) => acc._id === req.params.id);
    if (!acc) {
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any account ID` });
    }
    res.status(200).json(acc);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const addAcc = (req, res) => {
  try {
    const accs = readDataFromFile();
    const newAcc = { _id: String(Date.now()), ...req.body };
    accs.push(newAcc);
    writeDataToFile(accs);
    res.status(200).json(newAcc);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const modifyAcc = (req, res) => {
  try {
    const accs = readDataFromFile();
    const index = accs.findIndex((acc) => acc._id === req.params.id);
    if (index === -1) {
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any account ID` });
    }
    accs[index] = { ...accs[index], ...req.body };
    writeDataToFile(accs);
    res.status(200).json(accs[index]);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const deleteAcc = (req, res) => {
  try {
    const accs = readDataFromFile();
    const index = accs.findIndex((acc) => acc._id === req.params.id);
    if (index === -1) {
      return res
        .status(404)
        .json({ msg: `ID: ${req.params.id} does not match any account ID` });
    }
    const deletedAcc = accs.splice(index, 1);
    writeDataToFile(accs);
    res.status(200).json({ acc: deletedAcc });
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
