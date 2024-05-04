const db = require('./firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const mentorRouter = require('./controllers/mentorController.js');

app.use('/api/mentors', mentorRouter);

app.use(cors());
app.use(express.json());


// For Signup

app.post('/Signup', (req, res) => {
  const { userType , fullName, email, password } = req.body;
  console.log('Received user data:', req.body);

  // Add userType to the user data
  const userData = {
    fullName,
    email,
    password,
    userType,
    timestamp: new Date(),
  };

  // Determine the document path based on the userType
  const userDocPath = userType === 'mentor'? 'mentor' : 'mentee';

  // Add the user data to the Firestore database
  db.collection('users')
    .doc(userDocPath)
    .collection(userType)
    .add(userData)
    .then(() => {
      console.log('User data added to the database');
      res.send('User data received successfully');
    })
    .catch((error) => {
      console.error('Error adding user data:', error);
      res.status(500).send('Error adding user data');
    });
});


// For Login

// app.post('/Login', (req, res) => {
//   const { email, password } = req.body;
//   console.log('Received login data:', req.body);

//   // Authenticate the user based on their email and password
//   db.collection('users')
//     .where('email', '==', email)
//     .where('password', '==', password)
//     .get()
//     .then((querySnapshot) => {
//       if (querySnapshot.empty) {
//         console.log('No matching user found');
//         res.status(404).send('No matching user found');
//       } else {
//         console.log('User found:', querySnapshot.docs[0].data());
//         res.send('User authenticated successfully');
//       }
//     })
//     .catch((error) => {
//       console.error('Error authenticating user:', error);
//       res.status(500).send('Error authenticating user');
//     });
// });


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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});