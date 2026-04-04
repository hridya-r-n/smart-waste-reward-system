const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
  window.location.href = "../auth/login.html";
}

let allReports = [];
let activeFilter = "all";

window.setFilter = function (filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.filter === filter);
  });
  renderReports();
};

function renderReports() {
  const container = document.getElementById("adminReports");

  let filtered = allReports;
  if (activeFilter !== "all") {
    filtered = allReports.filter(r => r.status === activeFilter);
  }

  // Update stats
  const total = allReports.length;
  const pending = allReports.filter(r => r.status === "pending").length;
  const resolved = allReports.filter(r => r.status === "resolved").length;

  const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  el("stat-total", total);
  el("stat-pending", pending);
  el("stat-resolved", resolved);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1">
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <p>No reports found</p>
        </div>
      </div>
    `;
    return;
  }

  const severityBadge = (s) => `<span class="badge badge-${s}">${s}</span>`;
  const statusBadge = (s) => s === "resolved"
    ? `<span class="badge badge-resolved">✓ Resolved</span>`
    : `<span class="badge badge-pending">⏳ Pending</span>`;

  const typeEmoji = (t) => {
    const m = { plastic: "🧴", organic: "🍃", metal: "🔩", paper: "📄", electronic: "📱", glass: "🪟", chemical: "⚗️" };
    const key = Object.keys(m).find(k => t?.toLowerCase().includes(k));
    return key ? m[key] : "🗑️";
  };

  container.innerHTML = filtered.map((r, i) => `
    <div class="admin-report-card ${r.status === 'resolved' ? 'resolved' : ''}" style="animation-delay:${i * 0.04}s">
      <div class="arc-header">
        <div class="arc-location">${typeEmoji(r.wasteType)} ${r.location}</div>
        ${statusBadge(r.status)}
      </div>
      <div class="arc-body">
        <div class="arc-row">
          <span>Waste type</span>
          <span>${r.wasteType || "—"}</span>
        </div>
        <div class="arc-row">
          <span>Severity</span>
          ${severityBadge(r.severity || "low")}
        </div>
        <div class="arc-row">
          <span>Reported</span>
          <span>${formatDate(r.createdAt)}</span>
        </div>
      </div>
      ${r.status === "pending"
        ? `<button class="btn btn-resolve" onclick="resolve('${r._id}', this)">✓ Mark Resolved</button>`
        : `<button class="btn btn-ghost btn-sm" disabled style="width:100%;opacity:0.4">Resolved</button>`
      }
    </div>
  `).join("");
}

async function resolve(id, btn) {
  btn.disabled = true;
  btn.textContent = "Resolving…";

  try {
    const res = await fetch(`${API}/admin/resolve/${id}`, { method: "PUT" });
    if (!res.ok) throw new Error();

    showToast("Report marked as resolved ✓", "success");
    await loadReports();

  } catch (err) {
    showToast("Failed to resolve report", "error");
    btn.disabled = false;
    btn.textContent = "✓ Mark Resolved";
  }
}

async function loadReports() {
  const container = document.getElementById("adminReports");
  container.innerHTML = `<div style="grid-column:1/-1"><div class="loading"><div class="spinner"></div> Loading reports…</div></div>`;

  try {
    const res = await fetch(`${API}/admin/reports`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      container.innerHTML = `<div style="grid-column:1/-1"><div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load reports</p></div></div>`;
      return;
    }

    allReports = data;
    renderReports();

  } catch (err) {
    container.innerHTML = `<div style="grid-column:1/-1"><div class="empty-state"><div class="empty-icon">🔌</div><p>Server not reachable</p></div></div>`;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

loadReports();
