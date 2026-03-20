// const API = "http://localhost:5000/api";

// Submit report
window.submitReport = async function () {
  const user = JSON.parse(localStorage.getItem("user"));

  const location = document.getElementById("location").value;
  const wasteType = document.getElementById("wasteType").value;
  const severity = document.getElementById("severity").value;

  await fetch(`${API}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user._id || user.id,
      location,
      wasteType,
      severity
    })
  });

  loadReports();
};
// Load reports
async function loadReports() {
  const res = await fetch(`${API}/reports`);
  const data = await res.json();

  // ✅ Prevent crash
  if (!Array.isArray(data)) {
    console.error("Backend error:", data);
    return;
  }

  const list = document.getElementById("reports");
  list.innerHTML = "";

  data.forEach(r => {
    const li = document.createElement("li");
    li.innerText = `${r.location} - ${r.status}`;
    list.appendChild(li);
  });
}

loadReports();