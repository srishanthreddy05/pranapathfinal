// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBje44kEv3bsmIP_x5_LK2YkkKDq9hJFfU",
    authDomain: "ambulancemanagementsystem0103.firebaseapp.com",
    databaseURL: "https://ambulancemanagementsystem0103-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ambulancemanagementsystem0103",
    storageBucket: "ambulancemanagementsystem0103.appspot.com",
    messagingSenderId: "492214508421",
    appId: "1:492214508421:web:f2b626eff3ae7c8b73c2ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
