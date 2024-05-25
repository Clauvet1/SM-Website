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
const editProfile = require('./routes/editProfile');
app.use('/api/editProfile', editProfile);

//For Mentee
const mentees = require('./routes/mentees');
app.use('/api/mentees', mentees);

//For Messaging
// Sending Message
app.post('/send-message', async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;
    await db.collection('messages').add({
      sender,
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
app.get('/messages', async (req, res) => {
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

//middleware to verify token
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    next();
  } catch(error) {
    return res.status(401).send({ error: 'Invalid token' });
  }
};
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.uid);
    const userData = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
    };
    // Add any additional data you want to retrieve from your database
    // For example, if you have a Firestore collection called "users"
    // const userDoc = await db.collection('users').doc(req.uid).get();
    // if (userDoc.exists) {
    //   userData.skills = userDoc.data().skills;
    //   // Add any other fields you want to retrieve
    // }
    res.send(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while retrieving user data.' });
  }
});

// For logout
const logout = require('./routes/logout');
app.use('/api/logout', logout);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});