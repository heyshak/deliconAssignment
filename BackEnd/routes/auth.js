const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

router.get("/", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});

router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "password is required").exists(),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) res.status(401).json({ errors: errors.array() });

      let user = await User.findOne({ email });
      if (!user)
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 86400 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token: token,
            msg: "login SUccesfully",
            id: user.id,
            name: user.name,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(400).json({ msg: "server error" });
    }
  }
);
module.exports = router;
