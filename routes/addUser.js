const express = require("express");
const router = express.Router();
// const User = require("../models/customerSchema");

const userControllers = require("../controllers/userControllers");
var moment = require("moment");
const {requireAuth} = require("../middleware/middleware");

router.get("", requireAuth, userControllers.user_add_get);
// POST Requst
router.post("", userControllers.user_post);

module.exports = router;