const express = require('express');
const router = express.Router();
const { db, auth } = require("../firebase-admin");
router.post('/', async (req, res) => {
    const {fullName, email, phone, language, school, specialty, bio, userType, location } = req.body;
    console.log('Received user data:', req.body);
  
    const userData = {
      fullName,
      email,
      phone, 
      language, 
      school,
      location,
      specialty, 
      bio,
      timestamp: new Date(),
    };
      if(userType === 'mentee'){
        try {
          const mentorRef = await db.collection('mentees').add(userData);
          console.log(`Mentor document created with ID: ${mentorRef.id} in mentors collection`);
          res.send(`Mentor data received successfully in mentors collection`);
        } catch (error) {
          console.error(`Error adding mentor data to mentors collection:`, error);
          res.status(500).send(`Error adding mentor data to mentors collection: ${error}`);
        }
      } 
      if(userType === 'mentor'){
        try {
          const mentorRef = await db.collection('mentors').add(userData);
          console.log(`Mentor document created with ID: ${mentorRef.id} in mentors collection`);
          res.send(`Mentor data received successfully in mentors collection`);
        } catch (error) {
          console.error(`Error adding mentor data to mentors collection:`, error);
          res.status(500).send(`Error adding mentor data to mentors collection: ${error}`);
        }
      }
    
  });

  module.exports = router;