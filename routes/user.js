const { Router } = require("express");
const router = Router();

const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

module.exports = router;
