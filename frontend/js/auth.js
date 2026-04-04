async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }

  const btn = document.getElementById("register-btn");
  btn.disabled = true;
  btn.textContent = "Creating account…";

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Registration failed", "error");
      return;
    }

    showToast("Account created! Redirecting…", "success");
    setTimeout(() => { window.location.href = "login.html"; }, 1200);

  } catch (err) {
    showToast("Network error. Is the server running?", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Create account";
  }
}

window.login = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showToast("Please enter your credentials", "error");
    return;
  }

  const btn = document.getElementById("login-btn");
  btn.disabled = true;
  btn.textContent = "Signing in…";

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Login failed", "error");
      return;
    }

    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(data));

    showToast(`Welcome back, ${data.name}!`, "success");

    setTimeout(() => {
      if (data.role && data.role.toLowerCase().trim() === "admin") {
        window.location.href = "../admin/dashboard.html";
      } else {
        window.location.href = "../user/dashboard.html";
      }
    }, 800);

  } catch (err) {
    showToast("Network error. Is the server running?", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Sign in";
  }
};
