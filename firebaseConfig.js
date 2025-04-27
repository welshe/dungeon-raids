const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Ensure this file is downloaded

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://your-database-url.firebaseio.com" // Replace with your actual Firebase database URL
});

const db = admin.database();
module.exports = db;
