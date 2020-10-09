const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Hotel = require("../models/Hotel");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");

//@route POST Hotel
//@desc  Add new registration of hotel
//@access Private
router.post(
  "/",
  [
    auth,
    [
      check("hotelName", "Hotel Name is required").not().isEmpty(),
      check("address", "Address  is required").not().isEmpty(),
      check("stars", "stars  is required").not().isEmpty(),
      check("email", "Email  is required").not().isEmpty(),
      check("contactNumber", "Contact Number  is required").not().isEmpty(),
      check("website", "Website is required").not().isEmpty(),
      check("description", "Description  is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const {
      hotelName,
      address,
      stars,
      email,
      contactNumber,
      website,
      description,
    } = req.body;

    //Build Hotel Object
    const hotelFields = {};
    hotelFields.user = req.user.id;
    if (hotelName) hotelFields.hotelName = hotelName;
    if (address) hotelFields.address = address;
    if (stars) hotelFields.stars = stars;
    if (email) hotelFields.email = email;
    if (contactNumber) hotelFields.contactNumber = contactNumber;
    if (website) hotelFields.website = website;
    if (description) hotelFields.description = description;

    try {
      //Create
      const hotel = new Hotel(hotelFields);

      await hotel.save();
      res.json(hotel);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// Get all the hotel of specific user

router.get("/:user_id", async (req, res) => {
  try {
    const hotel = await Hotel.find({
      user: req.params.user_id,
    });

    if (hotel.length === 0)
      return res.status(404).json({ msg: "Hotel not found" });

    res.json(hotel);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Hotel not found" });
    }
    return res.status(500).json("Server Error");
  }
});
//@route DELETE Hotel
//@desc  Delete Hotel
//@access Private

router.delete("/:id", auth, async (req, res) => {
  //Delete Hotel
  await Hotel.findOneAndRemove({ user: req.user.id });

  res.json({ msg: "Hotel Deleted" });
});

module.exports = router;
