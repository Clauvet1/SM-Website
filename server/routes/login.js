const express = require('express');
const router = express.Router();
const { db, auth } = require("../firebase-admin");
const bcrypt = require('bcryptjs');
router.post("/", async (req, res) => {
    const { email, password, userType } = req.body;
  
    try {
      // Authenticate the user with the Firebase Realtime Database
      const snapshot = await db.collection(userType).get();
  
      const mentorData = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        mentorData.push({
          id: doc.id,
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        });
      });
  
      console.log('data:', mentorData);
      let user = null;
  
      for (const u of mentorData) {
        if (u.email === email) {
          user = u;
          break;
        }
      }
  
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: "Invalid email or password" });
      }
  
      // Generate a custom token for the user
      const customToken = await auth.createCustomToken(user.id); // Use the id property instead of uid
  
      // Send the custom token back to the client
      res.json({ success: true, token: customToken });
    } catch (error) {
      console.log("Error in login endpoint:", error);
      res.status(500).json({ success: false, message: "An error occurred while logging in. Please try again later." });
    }
  });

  module.exports = router;