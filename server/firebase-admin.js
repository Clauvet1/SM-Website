const admin = require("firebase-admin");
const serviceAccount = require("./sm-website-d64fd-firebase-adminsdk-tpujz-a9ddc0f8d7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sm-website-d64fd-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = {db, auth};