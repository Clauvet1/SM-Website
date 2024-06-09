const { db, auth } = require("./firebase-admin");
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;



app.use(cors({origin:'http://localhost:3000'}));
// Middleware to parse JSON bodies
app.use(express.json());

// For Signup

const signup = require('./routes/signup');
app.use('/api/signup', signup);


// For Login
const login = require('./routes/login');
app.use('/api/login', login);

//For Mentors

const mentors = require('./routes/mentors');
app.use('/api/mentors', mentors);

// For MentorEditProfile
const editMProfile = require('./routes/editMProfile');
app.use('/api/editMProfile', editMProfile);

const editMenteeProfile = require('./routes/editMenteeProfile');
app.use('/api/editMenteeProfile', editMenteeProfile);

//For Mentee
const mentees = require('./routes/mentees');
app.use('/api/mentees', mentees);

//For Messaging
// Sending Message
app.post('/send-message', async (req, res) => {
  const cookie = req.cookies.userInfo;
  if (!cookie) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id, email, userType } = cookie;

  // Use the user's ID and other details to send the message
  try {
    const { receiver, text } = req.body;
    await db.collection('messages').add({
      sender: id,
      receiver,
      text,
      timestamp: new Date(),
    });
    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while sending the message.' });
  }
});

// Receiving Message
app.get('/api/messages', async (req, res) => {
  try {
    const querySnapshot = await db.collection('messages').get();
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving messages.' });
  }
});

// profile
const mentorProfile = require('./routes/mentorProfile');
app.use('/api/mentor-profile', mentorProfile);

const menteeProfile = require('./routes/menteeProfile');
app.use('/api/mentee-profile', menteeProfile);

// For logout
const logout = require('./routes/logout');
app.use('/api/logout', logout);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

