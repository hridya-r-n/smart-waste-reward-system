async function loadLeaderboard() {
  const container = document.getElementById("leaderboard");
  container.innerHTML = `<div class="loading"><div class="spinner"></div> Loading leaderboard…</div>`;

  try {
    const res = await fetch(`${API}/users/leaderboard`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load leaderboard</p></div>`;
      return;
    }

    if (data.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">🏆</div><p>No users yet. Be the first to report!</p></div>`;
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const rankEmoji = ["🥇", "🥈", "🥉"];
    const rankClass = ["rank-1", "rank-2", "rank-3"];
    const avatarEmojis = ["🌿", "♻️", "🌱", "🌍", "💚", "🍃", "🌎", "🌳", "🌾", "🌻"];

    container.innerHTML = `<div class="leaderboard-list">
      ${data.map((u, i) => {
        const isMe = currentUser && (u._id === currentUser._id || u._id === currentUser.id);
        const rank = i < 3 ? rankEmoji[i] : `#${i + 1}`;
        const rankCls = i < 3 ? rankClass[i] : "rank-other";
        const avatar = avatarEmojis[i % avatarEmojis.length];

        return `
          <div class="lb-item ${isMe ? "is-me" : ""}" style="animation-delay:${i * 0.06}s">
            <div class="lb-rank ${rankCls}">${rank}</div>
            <div class="lb-avatar">${avatar}</div>
            <div class="lb-info">
              <div class="lb-name">${u.name}${isMe ? ' <span style="color:var(--green-light);font-size:12px">(You)</span>' : ''}</div>
              <div class="lb-sub">Eco Contributor</div>
            </div>
            <div>
              <div class="lb-points">${u.points}</div>
              <div class="lb-pts-label">points</div>
            </div>
          </div>
        `;
      }).join("")}
    </div>`;

    // Show user's own rank if not in top 10
    if (currentUser) {
      const myRank = data.findIndex(u => u._id === currentUser._id || u._id === currentUser.id);
      const rankNotice = document.getElementById("my-rank-notice");
      if (rankNotice) {
        if (myRank >= 0) {
          rankNotice.textContent = `Your rank: #${myRank + 1} with ${data[myRank].points} points`;
        } else {
          rankNotice.textContent = "Keep reporting to appear on the leaderboard!";
        }
      }
    }

  } catch (err) {
    document.getElementById("leaderboard").innerHTML =
      `<div class="empty-state"><div class="empty-icon">🔌</div><p>Server not reachable</p></div>`;
  }
}

loadLeaderboard();
