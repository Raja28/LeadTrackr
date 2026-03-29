const express = require("express");
const router = express.Router();
const {
  getLeads,
  updateLeadStatus,
} = require("../controllers/admin");
const { adminMiddleware } = require("../middlewares/adminMiddleware");



router.get("/leads", adminMiddleware, getLeads);
router.patch("/leads/:id", adminMiddleware, updateLeadStatus);

module.exports = router;