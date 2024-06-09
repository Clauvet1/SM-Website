const express = require('express');
var app = express();  
const router = express.Router();
const { db, auth } = require("../firebase-admin"); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Used for decoding the JWT

//  


  
//     try {
//       // Authenticate the user with the Firebase Realtime Database
//       const snapshot = await db.collection(userType).get();
  
//       const mentorData = [];
//       snapshot.forEach(doc => {
//         const data = doc.data();
//         mentorData.push({
//           id: doc.id,
//           fullName: data.fullName,
//           email: data.email,
//           password: data.password,
//         });
//       });
  
//       console.log('data:', mentorData);
//       let user = null;
  
//       for (const u of mentorData) {
//         if (u.email === email) {
//           user = u;
//           break;
//         }
//       }
  
//       if (!user) {
//         return res.status(400).json({ success: false, message: "User not found" });
//       }
  
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(400).json({ success: false, message: "Invalid email or password" });
//       }
  
//       // Generate a custom token for the user
//       const customToken = await auth.createCustomToken(user.id); // Use the id property instead of uid
  
//       // Send the custom token back to the client
//       res.json({ success: true, token: customToken });
//     } catch (error) {
//       console.log("Error in login endpoint:", error);
//       res.status(500).json({ success: false, message: "An error occurred while logging in. Please try again later." });
//     }
//   });

// Login endpoint
// Login endpoint
// router.post("/", async (req, res) => {
//   const { email, password, userType } = req.body;

//   try {
//     // Authenticate the user with the Firebase Realtime Database
//     const snapshot = await db.collection(userType).get();

//     let userId = null;
//     let userPassword = null;

//     snapshot.forEach(doc => {
//       const data = doc.data();
//       if (data.email === email) {
//         userId = doc.id;
//         userPassword = data.password;
//       }
//     });

//     if (!userId) {
//       return res.status(400).json({ success: false, message: "User not found" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, userPassword);
//     if (!isPasswordValid) {
//       return res.status(400).json({ success: false, message: "Invalid email or password" });
//     }

//     // Generate a custom token for the user
//     const customToken = await auth.createCustomToken(userId);

//     // Generate a cookie for the user
//     res.cookie('userInfo', {
//       id: userId,
//       email: email,
//       userType: userType,
//     }, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'none',
//       maxAge: 60*60*24*5, // 5 days
//     });

//     // Send a success response
//     res.json({ success: true, token: customToken, message: "Logged in successfully, Cookie set successfully" });
//   } catch (error) {
//     console.log("Error in login endpoint:", error);
//     res.status(500).json({ success: false, message: "An error occurred while logging in. Please try again later." });
//   }
// });




app.use(express.json());

router.post("/", async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const snapshot = await db.collection(userType).get();

    let userId = null;
    let userPassword = null;

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.email === email) {
        userId = doc.id;
        userPassword = data.password;
        userName = data.fullName; // Assuming `fullName` is the field for the user's name
      }
    });

    if (!userId) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generate a custom token for the user
    const customToken = await auth.createCustomToken(userId); 

    // Decode the custom token to check its structure
    const decodedToken = jwt.decode(customToken);

    // Log the decoded token for debugging purposes
    console.log('Decoded Token:', decodedToken);

    // Check if the token contains the expected data
    if (!decodedToken || !decodedToken.uid || decodedToken.uid !== userId) {
      return res.status(500).json({ success: false, message: "Failed to generate a valid token" });
    }

 

    // Send the token and user data back to the client
    res.json({ success: true, token: customToken, message: "Logged in successfully, cookies set" });
  } catch (error) {
    console.log("Error in login endpoint:", error);
    res.status(500).json({ success: false, message: "An error occurred while logging in. Please try again later." });
  }
});



  module.exports = router;