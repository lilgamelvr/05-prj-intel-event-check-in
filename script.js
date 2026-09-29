const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");

const storageKey = "intel-summit-checkin-state";
const maxCount = 50;

let count = 0;
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
let attendees = [];

const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

function saveState() {
  const state = {
    count: count,
    teamCounts: teamCounts,
    attendees: attendees,
  };

  localStorage.setItem(storageKey, JSON.stringify(state));
}

function updateProgressBar() {
  const percentage = Math.round((count / maxCount) * 100);
  const percentageText = percentage + "%";

  progressBar.style.width = percentageText;
  console.log(`Progress: ${percentageText}`);
}

function updateTeamCounts() {
  const teamKeys = Object.keys(teamCounts);

  teamKeys.forEach(function (teamKey) {
    const teamCounter = document.getElementById(teamKey + "Count");
    teamCounter.textContent = teamCounts[teamKey];
  });
}

function getWinningTeam() {
  const teamKeys = Object.keys(teamCounts);
  let winningTeam = teamKeys[0];

  teamKeys.forEach(function (teamKey) {
    if (teamCounts[teamKey] > teamCounts[winningTeam]) {
      winningTeam = teamKey;
    }
  });

  return teamLabels[winningTeam];
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "attendee-empty";
    emptyItem.textContent = "No attendees checked in yet.";
    attendeeList.appendChild(emptyItem);
    return;
  }

  attendees.forEach(function (attendee) {
    const attendeeItem = document.createElement("li");
    attendeeItem.className = "attendee-item";
    attendeeItem.dataset.team = attendee.teamKey;

    const nameText = document.createElement("span");
    nameText.className = "attendee-name";
    nameText.textContent = attendee.name;

    const teamText = document.createElement("span");
    teamText.className = "attendee-team";
    teamText.textContent = attendee.team;

    attendeeItem.appendChild(nameText);
    attendeeItem.appendChild(teamText);
    attendeeList.appendChild(attendeeItem);
  });
}

function loadState() {
  const savedState = localStorage.getItem(storageKey);

  if (savedState) {
    const parsedState = JSON.parse(savedState);

    count = parsedState.count || 0;
    teamCounts = {
      water: parsedState.teamCounts?.water || 0,
      zero: parsedState.teamCounts?.zero || 0,
      power: parsedState.teamCounts?.power || 0,
    };
    attendees = parsedState.attendees || [];
  }

  attendeeCount.textContent = count;
  updateProgressBar();
  updateTeamCounts();
  renderAttendeeList();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  count++;
  attendeeCount.textContent = count;
  teamCounts[team]++;
  attendees.push({
    name: name,
    team: teamName,
    teamKey: team,
  });
  saveState();
  updateProgressBar();
  updateTeamCounts();
  renderAttendeeList();
  console.log("Total check-ins: ", count);

  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  const winningTeam = getWinningTeam();
  const message = `🎉 Welcome, ${name} from ${teamName}`;

  if (count >= maxCount) {
    greeting.textContent = `🎉 Goal reached! ${winningTeam} wins the event!`;
    greeting.classList.remove("success-message");
    greeting.classList.add("celebration-message");
  } else {
    greeting.textContent = message;
    greeting.classList.remove("celebration-message");
    greeting.classList.add("success-message");
  }

  greeting.style.display = "block";
  console.log(greeting.textContent);

  form.reset();
});

loadState();
