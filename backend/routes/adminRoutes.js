const express = require("express");
const router = express.Router();

const {
  getAllReports,
  resolveReport
} = require("../controllers/adminController");

router.get("/reports", getAllReports);
router.put("/resolve/:id", resolveReport);

module.exports = router;