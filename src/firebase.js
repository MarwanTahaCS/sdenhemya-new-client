// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaRrhB3k6vojkDJsS_v4DBSipbK441szk",
  authDomain: "templates-f0a62.firebaseapp.com",
  projectId: "templates-f0a62",
  storageBucket: "templates-f0a62.appspot.com",
  messagingSenderId: "237214868826",
  appId: "1:237214868826:web:89565efaeea9f1c8c37f63",
  measurementId: "G-0PQK6TM1BJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);