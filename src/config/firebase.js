const admin = require('firebase-admin');
require('dotenv').config();

try {
  console.log('Initializing Firebase with config:', {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length
  });

  const firebaseConfig = {
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  };

  admin.initializeApp(firebaseConfig);
  const db = admin.firestore();
  
  // Test database connection
  db.collection('users').get()
    .then(() => console.log('Successfully connected to Firestore'))
    .catch(error => console.error('Error connecting to Firestore:', error));

  module.exports = db;
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
} 