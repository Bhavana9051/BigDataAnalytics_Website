const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Notification = require("./model/notification.model");

router.use(express.urlencoded({ extended: true }));

// Display users list with send message button
router.get("/userlist", async (req, res) => {
    try {
      const users = await User.find();
      res.render("userlist", { userlist : users });
    } catch (error) {
      console.log("Error retrieving users: " + error);
      res.status(500).send("Internal Server Error");
    }
  });
  

// Send message to a user
router.get("/users/:userId/send-message", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render("msg", { recipient: user });
  } catch (error) {
    console.log("Error retrieving user: " + error);
    res.status(500).send("Internal Server Error");
  }
});

// Handle sending the message
router.post("/users/:userId/send-message", async (req, res) => {
  try {
    const recipient = await User.findById(req.params.userId);
    // Send the email to the recipient using a suitable email service or library
    // Example using Nodemailer:
    const mailOptions = {
      from: "seburds@gmail.com",
      to: recipient.email,
      subject: "New Message from Admin",
      text: req.body.message,
    };
    // Send the email using the configured transporter

    // Save the notification in the database
    await Notification.create({
      sender: req.user._id, // Assuming you have authentication middleware that sets the req.user
      recipient: recipient._id,
      message: req.body.message,
    });

    res.redirect("/users");
  } catch (error) {
    console.log("Error sending message: " + error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
