// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5Wj1AWAQMw-zfZVIUrjB5Fv6c5lfN1H4",
  authDomain: "vg-tournament-vercel.firebaseapp.com",
  projectId: "vg-tournament-vercel",
  storageBucket: "vg-tournament-vercel.firebasestorage.app",
  messagingSenderId: "754479907493",
  appId: "1:754479907493:web:befceb42c936ce9618834c",
  measurementId: "G-VE9BV8265K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
