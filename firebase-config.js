// Firebase Configuration Central File
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOehZnvtRZVRGC412wL3k80Q3Ir-yUbDg",
  authDomain: "afnan-b5934.firebaseapp.com", // استخدام الدومين الافتراضي لفايربيز لضمان عمل الـ Popup
  projectId: "afnan-b5934",
  storageBucket: "afnan-b5934.firebasestorage.app",
  messagingSenderId: "639917316530",
  appId: "1:639917316530:web:f2c2adf84bd0f4ee50ecab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
