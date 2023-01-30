const express = require("express");
const {
  getAllAccs,
  getSingleAcc,
  addAcc,
  modifyAcc,
  deleteAcc,
} = require("../controllers/instagram");

const router = express.Router();

router.route("/").get(getAllAccs).post(addAcc);

router.route("/:id").get(getSingleAcc).patch(modifyAcc).delete(deleteAcc);

module.exports = router;
