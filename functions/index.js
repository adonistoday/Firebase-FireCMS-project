const functions = require("firebase-functions");
// import functions from "firebase-functions";
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();

const app1 = express();

// Handle CORS for all routes
app1.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );
  res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type",
  );
  next();
});


// Handle the POST request for the login form
app1.post("/login", async (req, res) => {
  const {email} = req.body;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    // await admin.auth().signInWithEmailAndPassword(email, password);
    res.status(200).send(`Logged in as ${userRecord.email}`);
  } catch (error) {
    res.status(401).send("Invalid email or password");
  }
});

// Handle the POST request to save changes
app1.post("/savechanges", async (req, res) => {
  const {data} = req.body;
  try {
    const db = admin.firestore();
    const querySnapshot = await db
        .collection("business-list")
        .where("email", "==", data.email)
        .where("business_name", "==", data.business_name)
        .limit(1)
        .get();
    const docId = querySnapshot.docs[0].id;
    console.log(`Document ID: ${docId}`);
    const docRef = db.collection("business-list").doc(docId);
    await docRef.update(data);
    const datatext="Changes saved successfully!";
    // Send a response indicating success
    res.status(200).send(JSON.stringify({msg: datatext}));
  } catch (error) {
    // Send a response indicating failure
    res.status(500).send("Error saving changes: " + error);
  }
});
app1.post("/signup1", async (req, res) => {
  const {email, password, firstName, lastName} = req.body;
  try {
    // Check if user already exists
    const userRecord = await admin.auth().getUserByEmail(email);
    const datatext=`Email:${userRecord.email}${firstName} already in use`;
    res.status(409).send(JSON.stringify({msg: datatext}));
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      // If user doesn't exist, create a new one
      try {
        const user = await admin.auth().createUser({
          email: email,
          password: password,
        });
        const db = admin.firestore();
        // await db.collection("business-list").doc().set({
        //   first_name: firstName,
        //   // other fields
        // });
        // Add a new document with an automatically generated ID to a collection
        const newDocRef = await db.collection("business-list").add({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        });
        const datatext=`${user.uid},${newDocRef} created successfully`;
        res.status(200).send(JSON.stringify({msg: datatext}));
      } catch (error) {
        res.status(500).send(`Error creating user: ${error}`);
      }
    } else {
      res.status(500).send(`Error checking user: ${error}`);
    }
  }
});
app1.post("/editproduct", async (req, res) => {
  const {
    email,
    productName,
    newproductName,
    newproductPrice,
    newproductDescription,
    image,
  } = req.body;
  // const image = req.file;
  try {
    const db = admin.firestore();
    const querySnapshot = await db
        .collection("product-list")
        .where("email", "==", email)
        .where("productName", "==", productName)
        .limit(1)
        .get();
    const docId = querySnapshot.docs[0].id;
    console.log(`Document ID':${docId}`);
    // // Upload the image file to Firebase storage
    // const storageRef = admin.storage().bucket();
    // const file = storageRef.file(imagename);
    // await file.save(image.buffer, {
    //   metadata: {contentType: image.mimetype},
    // });
    // const imageUrl = await file.getSignedUrl({
    //   action: "read",
    //   expires: "03-09-2491",
    // });

    const docRef = db.collection("product-list").doc(docId);
    const data={
      productName: newproductName,
      productPrice: newproductPrice,
      productDescription: newproductDescription,
      image: image, 
    }; 
    await docRef.update(data);
    const datatext = "Changes saved successfully";
    res.status(200).send(JSON.stringify({msg: datatext}));
  } catch (error) {
    res.status(500).send("Error saving changes:" + error);
  }
});


// Export the Express app as a Firebase Function
exports.app = functions.https.onRequest(app1);
