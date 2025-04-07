let startTime, interval;
let isRunning = false;

const timerDisplay = document.getElementById("Timer");
const choreInput = document.getElementById("Chore");
const leaderboard = document.getElementById("Leaderboard");

document.getElementById("startBtn").addEventListener("click", () => {
  if (isRunning) return;
  isRunning = true;
  startTime = Date.now();
  interval = setInterval(updateTimer, 100);
});

document.getElementById("stopBtn").addEventListener("click", () => {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(interval);
  saveTime();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  isRunning = false;
  clearInterval(interval);
  timerDisplay.textContent = "00:00:00";
});

function updateTimer() {
  const elapsed = Date.now() - startTime;
  const seconds = Math.floor((elapsed / 1000) % 60);
  const minutes = Math.floor((elapsed / 1000 / 60) % 60);
  const hours = Math.floor(elapsed / 1000 / 60 / 60);

  timerDisplay.textContent = 
    `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
  return num.toString().padStart(2, "0");
}

function saveTime() {
  const chore = choreInput.value || "Unnamed Chore";
  const time = timerDisplay.textContent;
  const key = `chore_${chore}`;
  let times = JSON.parse(localStorage.getItem(key)) || [];
  times.push(time);
  times.sort(); // sort lexicographically, okay for HH:MM:SS
  times = times.slice(0, 5); // keep top 5
  localStorage.setItem(key, JSON.stringify(times));
  displayLeaderboard(chore, times);
}

function displayLeaderboard(chore, times) {
  leaderboard.innerHTML = `<strong>${chore}</strong>`;
  times.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    leaderboard.appendChild(li);
  });
}

// Load last chore leaderboard
choreInput.addEventListener("input", () => {
  const chore = choreInput.value;
  const key = `chore_${chore}`;
  const times = JSON.parse(localStorage.getItem(key)) || [];
  displayLeaderboard(chore, times);
});
