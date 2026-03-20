const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
  window.location.href = "../auth/login.html";
}

async function loadReports() {
  const res = await fetch(`${API}/admin/reports`);
  const data = await res.json();

  const container = document.getElementById("adminReports");
  container.innerHTML = "";

  data.forEach(r => {
    container.innerHTML += `
      <div class="item">
        <h4>${r.location}</h4>
        <p>${r.wasteType}</p>
        <p class="${r.severity}">${r.severity}</p>
        <p>Status: ${r.status}</p>

        ${
          r.status === "pending"
            ? `<button onclick="resolve('${r._id}')">Resolve</button>`
            : `<span> Done</span>`
        }
      </div>
    `;
  });
}

async function resolve(id) {
  await fetch(`${API}/admin/resolve/${id}`, {
    method: "PUT"
  });

  loadReports();
}

loadReports();