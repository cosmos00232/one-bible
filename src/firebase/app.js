import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpF7seqSRoJsaJogh5Re08DK3aIISW9vA",
  authDomain: "one-bible-pwa.firebaseapp.com",
  databaseURL: "https://one-bible-pwa-default-rtdb.firebaseio.com",
  projectId: "one-bible-pwa",
  storageBucket: "one-bible-pwa.appspot.com",
  messagingSenderId: "529759944358",
  appId: "1:529759944358:web:3d66fd695a2da3ce4d3e67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app
