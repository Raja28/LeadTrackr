const express = require("express");
const { guestEnrollmentRequest } = require("../controllers/guest");
const router = express.Router();

router.post("/enroll", guestEnrollmentRequest);

module.exports = router;