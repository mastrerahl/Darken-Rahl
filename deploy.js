// deploy.js
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase-config.js";

const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById("deployForm");
const feedback = document.getElementById("feedback");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const botName = document.getElementById("botName").value.trim();
    const ownerName = document.getElementById("ownerName").value.trim();
    const ownerNumber = document.getElementById("ownerNumber").value.trim();
    const engineType = document.getElementById("engineType").value;

    if (!botName || !ownerName || !ownerNumber || !engineType) {
      feedback.textContent = "Please fill all fields.";
      feedback.classList.remove("hidden", "text-green-400");
      feedback.classList.add("text-red-400");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      feedback.textContent = "User data not found.";
      feedback.classList.remove("hidden", "text-green-400");
      feedback.classList.add("text-red-400");
      return;
    }

    const userData = userSnap.data();
    const currentCoins = userData.coins || 0;

    if (currentCoins < 10) {
      feedback.textContent = "You need at least 10 coins to deploy a bot. Try again after claiming daily coins.";
      feedback.classList.remove("hidden", "text-green-400");
      feedback.classList.add("text-red-400");
      return;
    }

    try {
      // Save bot details
      await addDoc(collection(db, "bots"), {
        botName,
        ownerName,
        ownerNumber,
        engine: engineType,
        userId: user.uid,
        deployedAt: new Date(),
      });

      // Deduct coins
      await updateDoc(userDocRef, {
        coins: currentCoins - 10,
      });

      feedback.textContent = "✅ Bot deployed successfully using " + engineType.toUpperCase() + " engine!";
      feedback.classList.remove("hidden", "text-red-400");
      feedback.classList.add("text-green-400");

      form.reset();
    } catch (error) {
      console.error("Error deploying bot:", error);
      feedback.textContent = "An error occurred while deploying the bot.";
      feedback.classList.remove("hidden", "text-green-400");
      feedback.classList.add("text-red-400");
    }
  });
});
