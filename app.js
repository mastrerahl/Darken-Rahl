// app.js
const DEMO_USER_ID = "demo_user";

// Daily coin claim
async function claimDailyCoins() {
  const userRef = db.collection("users").doc(DEMO_USER_ID);
  const doc = await userRef.get();
  const today = new Date().toDateString();
  const data = doc.exists ? doc.data() : { coins: 0, lastClaim: "" };

  if (data.lastClaim !== today) {
    await userRef.set({
      coins: (data.coins || 0) + 20,
      lastClaim: today
    }, { merge: true });
    alert("🎉 Claimed 20 coins for today!");
    location.reload();
  } else {
    alert("😴 Already claimed today. Come back tomorrow!");
  }
}

async function getCoinCount() {
  const doc = await db.collection("users").doc(DEMO_USER_ID).get();
  return doc.exists ? doc.data().coins : 0;
}
