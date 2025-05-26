// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUBWq0QZpJMt2t_gDqlOYSqmRcf4pK9nc",
  authDomain: "forever-bottle.firebaseapp.com",
  projectId: "forever-bottle",
  storageBucket: "forever-bottle.firebasestorage.app",
  messagingSenderId: "205290037654",
  appId: "1:205290037654:web:b11e1fb85b711bfaad7db7",
  measurementId: "G-8DQY8FXR2G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };

export default app;
