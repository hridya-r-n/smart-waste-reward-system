console.log("auth.js loaded");
async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, password })
  });

  alert("Registered!");
  window.location.href = "login.html";
}

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  localStorage.clear()

  localStorage.setItem("user", JSON.stringify(data));
  console.log("data:", data);
  if (data.role && data.role.toLowerCase().trim() === "admin") {
    window.location.href = "../admin/dashboard.html";
  } else {
    window.location.href = "../user/dashboard.html";
  }
}