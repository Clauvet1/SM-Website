const express = require('express');
const router = express.Router();
const db = require('firebase-admin');

router.get('/api/mentors', async (req, res) => {
  try {
    const mentorsRef = db.collection('users');
    const query = mentorsRef.where('mentor', '==', true);
    const querySnapshot = await query.get();
    const mentorData = [];
    querySnapshot.forEach((doc) => {
      mentorData.push({
        id: doc.id,
        name: doc.data().name,
        specialty: doc.data().specialty,
        bio: doc.data().bio,
        image: doc.data().image,
      });
    });
    res.json(mentorData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching mentor data.' });
  }
});

module.exports = router;