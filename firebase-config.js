// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiudkQ1_YW7r7hq0ScQJCaC3CVddcDZKs",
  authDomain: "otter-a8e5a.firebaseapp.com",
  projectId: "otter-a8e5a",
  storageBucket: "otter-a8e5a.appspot.com",
  messagingSenderId: "532065225871",
  appId: "1:532065225871:web:d01b167a7e3d80becef4fa",
  measurementId: "G-BFN8YXSSXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
