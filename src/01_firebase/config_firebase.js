// src/01_firebase/config_firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBoErnxPZd7f2jlfI-b5TRr6mnqcLjyBJU",
  authDomain: "expedia-clone-d0efa.firebaseapp.com",
  projectId: "expedia-clone-d0efa",
  storageBucket: "expedia-clone-d0efa.firebasestorage.app",
  messagingSenderId: "575599355814",
  appId: "1:575599355814:web:231c2f07d30454e6d3d167",
  measurementId: "G-CKFXQJCHTQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}


export { app, auth, analytics };
