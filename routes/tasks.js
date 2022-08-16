const express = require("express");
const {
  getAllTasks,
  getSingleTask,
  addTask,
  modifyTask,
  deleteTask,
} = require("../controllers/tasks");

const router = express.Router();

router.route("/").get(getAllTasks).post(addTask);

router.route("/:id").get(getSingleTask).patch(modifyTask).delete(deleteTask);

module.exports = router;
