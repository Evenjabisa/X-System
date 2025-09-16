const express = require("express");
const router = express.Router();
var moment = require("moment");

const userController = require("../controllers/userControllers");
var { requireAuth } = require("../middleware/middleware");
const { checkIfUser } = require("../middleware/middleware");
const authControllers = require("../controllers/authControllers");

const { check, validationResult } = require("express-validator");
router.use(checkIfUser);

// ================== Routes ==================

// update profile image
router.post(
  "/update-profile",
  requireAuth,
  authControllers.upload.single("avatar"),   
  authControllers.profile_image_update
);

// صفحات الدخول والخروج والتسجيل
router.get("/", authControllers.get_Welcome);
router.get("/signout", authControllers.get_signout);
router.get("/login", authControllers.get_login);
router.get("/signup", authControllers.get_signup);

router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter, 1 number and 1 special char"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
  ],
  authControllers.post_signup
);

router.post("/login", authControllers.post_login);

// صفحات المستخدم
router.get("/home", requireAuth, userController.user_index_get);
router.get("/edit/:id", requireAuth, userController.user_edit_get);
router.get("/view/:id", requireAuth, userController.user_view_get);
router.post("/search", userController.user_search_post);

router.delete("/edit/:id", userController.user_delete);
router.put("/edit/:id", userController.user_put);

module.exports = router;
