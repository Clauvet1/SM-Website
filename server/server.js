const { db, auth } = require("./firebase-admin");
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;



app.use(cors({origin:'http://localhost:3000'}));
// Middleware to parse JSON bodies
app.use(express.json());

// For Signup

const bcrypt = require('bcryptjs');

// Function to hash a password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    const hashedPassword = await bcrypt.hash(password, salt); // Hash password with generated salt
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error; // Throw error for handling further up the call stack
  }
};

app.post('/Signup', async (req, res) => {
  const { userType, fullName, email, password, specialty } = req.body;
  console.log('Received user data:', req.body);
  const hashedPassword = await hashPassword(password);

  const userData = {
    fullName,
    email,
    password: hashedPassword,
    timestamp: new Date(),
  };

  if (userType === 'mentor') {
    userData.specialty = specialty;
    try {
      const mentorRef = await db.collection('mentors').add(userData);
      console.log(`Mentor document created with ID: ${mentorRef.id} in mentors collection`);
      res.send(`Mentor data received successfully in mentors collection`);
    } catch (error) {
      console.error(`Error adding mentor data to mentors collection:`, error);
      res.status(500).send(`Error adding mentor data to mentors collection: ${error}`);
    }
  } else if (userType === 'mentee') {
    try {
      const menteeRef = await db.collection('mentees').add(userData);
      console.log(`Mentee document created with ID: ${menteeRef.id} in mentees collection`);
      res.send(`Mentee data received successfully in mentees collection`);
    } catch (error) {
      console.error(`Error adding mentee data to mentees collection:`, error);
      res.status(500).send(`Error adding mentee data to mentees collection: ${error}`);
    }
  } else {
    res.status(400).send('Invalid userType');
  }
});



// For Login

app.post("/api/login", async (req, res) => {
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
    if (mentorData.empty) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const user = mentorData[0]; // Get the first element of the array
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

//For Mentors

app.get('/api/mentors', async (req, res) => {
  try {
    const snapshot = await db.collection('mentors').get();

    const mentorData = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      mentorData.push({
        id: doc.id,
        fullName: data.fullName,
        email: data.email,
        specialty: data.specialty,
      });
    });

    res.json(mentorData);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




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


// For logout

app.post("/api/logout", async (req, res) => {
  // Invalidate the user's session
  req.destroy();

  
  // Redirect the user to the login page
  res.redirect("/login");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});