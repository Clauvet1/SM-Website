import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

const handleSendMessage = async () => {
  try {
    await db.collection('messages').add({
      sender: sender,
      receiver: receiver,
      text: newMessage,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setNewMessage('');
  } catch (error) {
    console.error(error);
  }
};

const getMessageData = async () => {
  try {
    const messagesRef = db.collection('messages');
    const receiversRef = messagesRef.doc('receiver');
    const sendersRef = messagesRef.doc('sender');

    const receiverData = await receiversRef.get();
    const senderData = await sendersRef.get();

    const mentorId = receiverData.get('mentor-id');
    const menteeId = receiverData.get('mentee-id');

    // Use the mentorId and menteeId as needed
  } catch (error) {
    console.error(error);
  }
};