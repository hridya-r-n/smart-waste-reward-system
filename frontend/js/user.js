const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "../auth/login.html";
}

let allReports = [];
let activeFilter = "all";

window.submitReport = async function () {
  const location = document.getElementById("location").value.trim();
  const wasteType = document.getElementById("wasteType").value.trim();
  const severity = document.getElementById("severity").value;

  if (!location || !wasteType) {
    showToast("Please fill in location and waste type", "error");
    return;
  }

  const btn = document.getElementById("submit-btn");
  btn.disabled = true;
  btn.textContent = "Submitting…";

  try {
    const res = await fetch(`${API}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id || user.id,
        location,
        wasteType,
        severity
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Failed to submit report", "error");
      return;
    }

    // Update local points display
    user.points = (user.points || 0) + 10;
    localStorage.setItem("user", JSON.stringify(user));

    const ptsEl = document.getElementById("user-points");
    if (ptsEl) ptsEl.textContent = `${user.points} pts`;

    const totalEl = document.getElementById("stat-points");
    if (totalEl) totalEl.textContent = user.points;

    document.getElementById("location").value = "";
    document.getElementById("wasteType").value = "";
    document.getElementById("severity").value = "low";

    showToast("Report submitted! +10 points earned 🎉", "success");
    loadReports();

  } catch (err) {
    showToast("Network error. Is the server running?", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Submit Report";
  }
};

window.setFilter = function(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.filter === filter);
  });
  renderReports();
};

function renderReports() {
  const list = document.getElementById("reports-list");
  const countEl = document.getElementById("report-count");

  let filtered = allReports;
  if (activeFilter !== "all") {
    filtered = allReports.filter(r => r.status === activeFilter);
  }

  // Update stat
  const statTotal = document.getElementById("stat-reports");
  if (statTotal) statTotal.textContent = allReports.length;

  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>No reports found</p>
      </div>
    `;
    return;
  }

  const severityLabel = { high: "🔴 High", medium: "🟡 Medium", low: "🟢 Low" };
  const typeEmoji = (t) => {
    const m = { plastic: "🧴", organic: "🍃", metal: "🔩", paper: "📄", electronic: "📱", glass: "🪟", chemical: "⚗️" };
    const key = Object.keys(m).find(k => t?.toLowerCase().includes(k));
    return key ? m[key] : "🗑️";
  };

  list.innerHTML = filtered.map((r, i) => `
    <div class="report-item" style="animation-delay:${i * 0.05}s">
      <div class="report-left">
        <div class="report-location">${typeEmoji(r.wasteType)} ${r.location}</div>
        <div class="report-meta">
          <span>${r.wasteType || "—"}</span>
          <span class="badge badge-${r.severity || 'low'}">${severityLabel[r.severity] || r.severity}</span>
          <span>${formatDate(r.createdAt)}</span>
        </div>
      </div>
      <div class="report-right">
        <span class="badge badge-${r.status}">${r.status === "resolved" ? "✓ Resolved" : "⏳ Pending"}</span>
      </div>
    </div>
  `).join("");
}

async function loadReports() {
  const list = document.getElementById("reports-list");
  list.innerHTML = `<div class="loading"><div class="spinner"></div> Loading reports…</div>`;

  try {
    const res = await fetch(`${API}/reports`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      list.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load reports</p></div>`;
      return;
    }

    allReports = data;
    renderReports();

  } catch (err) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🔌</div><p>Server not reachable</p></div>`;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Init stats
if (user) {
  const pEl = document.getElementById("stat-points");
  if (pEl) pEl.textContent = user.points || 0;
}

loadReports();
