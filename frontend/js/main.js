const API = "http://localhost:5000/api";

function logout() {
  localStorage.removeItem("user");
  window.location.href = "../auth/login.html";
}

function goBack() {
  window.location.href = "../index.html";
}

// Toast notifications
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Update navbar with user info
function initNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const badge = document.getElementById("user-badge");
  const pointsBadge = document.getElementById("user-points");

  if (user && badge) {
    const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
    badge.innerHTML = `
      <div class="user-avatar">${initial}</div>
      ${user.name || "User"}
    `;
  }

  if (user && pointsBadge) {
    pointsBadge.textContent = `${user.points || 0} pts`;
  }
}

document.addEventListener("DOMContentLoaded", initNavbar);
