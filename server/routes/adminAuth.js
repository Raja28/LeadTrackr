const express = require("express");
const { adminLogin, adminRegister, adminLogout } = require("../controllers/auth");
const router = express.Router();

router.post("/login", adminLogin);
router.post("/register", adminRegister);
router.post("/logout", adminLogout);

module.exports = router;
