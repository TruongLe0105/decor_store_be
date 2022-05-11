const express = require("express");
const { loginWithEmailPassword } = require("../controllers/auth.controller");
const router = express.Router();

/**
 * @route POST api/auth/login
 * @description Login with email
 * @access Public
 */
router.post("/login", loginWithEmailPassword);

module.exports = router;