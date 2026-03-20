async function loadLeaderboard() {
  try {
    const res = await fetch(`${API}/users/leaderboard`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Error:", data);
      return;
    }

    const container = document.getElementById("leaderboard");
    const currentUser = JSON.parse(localStorage.getItem("user"));
    container.innerHTML = "";
    

    data.forEach((user, index) => {
      const div = document.createElement("div");
      div.className = "card";

      if (currentUser) {
        div.style.background =
          user._id === currentUser._id ? "#e8f5e9" : "white";
      }
      div.innerHTML = `
        <h3>#${index + 1} ${user.name}</h3>
        <p>Points: ${user.points}</p>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
  }
}

loadLeaderboard();