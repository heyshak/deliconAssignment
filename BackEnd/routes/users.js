const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password length must be 6 or greater").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      //Check if user exist
      let user = await User.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
      //getting user avatar

      user = new User({
        name,
        email,
        password,
      });

      //Encrypt the password
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);

      //Return JSON webtoken

      const payload = {
        user: {
          id: user.id,
        },
      };
      // console.log("payload" + payload.user.id);

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      await user.save();
      //   res.send("User regsitered");
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Server Error");
    }
  }
);

module.exports = router;
