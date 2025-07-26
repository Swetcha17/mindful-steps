import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { firebaseConfig } from './firebase.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "auth.html";
  } else {
    const logoutBtn = document.getElementById("logout-btn");
    const userDisplay = document.getElementById("user-display");
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userDisplay) userDisplay.textContent = user.email;
  }
});

document.getElementById("logout-btn")?.addEventListener("click", () => {
  const auth = getAuth();
  auth.signOut().then(() => {
    window.location.href = "auth.html";
  });
});
