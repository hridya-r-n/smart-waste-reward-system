const API = "http://localhost:5000/api";
function logout() {
  localStorage.removeItem("user");
  window.location.href = "../auth/login.html";
}
function goBack() {
  window.location.href = "../index.html";
}