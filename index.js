const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

admin.initializeApp();

const app = express();

// Handle CORS for all routes
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Handle the POST request for the login form
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    await admin.auth().signInWithEmailAndPassword(email, password);
    res.status(200).send(`Logged in as ${userRecord.email}`);
  } catch (error) {
    res.status(401).send('Invalid email or password');
  }
});

// Export the Express app as a Firebase Function
exports.app = functions.https.onRequest(app);
