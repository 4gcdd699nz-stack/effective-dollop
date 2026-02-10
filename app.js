const STORAGE_KEY = "pyrolysis.records.v1";

const form = document.getElementById("record-form");
const recordsList = document.getElementById("records-list");
const emptyState = document.getElementById("empty-state");
const filterType = document.getElementById("filter-type");
const searchInput = document.getElementById("search");
const clearButton = document.getElementById("clear-records");
const recordTemplate = document.getElementById("record-template");

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function toDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function filteredRecords(records) {
  const type = filterType.value;
  const term = searchInput.value.trim().toLowerCase();

  return records.filter((record) => {
    const typeMatch = type === "All" || record.type === type;
    const fullText = `${record.area} ${record.team} ${record.details}`.toLowerCase();
    const searchMatch = !term || fullText.includes(term);
    return typeMatch && searchMatch;
  });
}

function renderRecords() {
  const records = loadRecords();
  const visible = filteredRecords(records);
  recordsList.innerHTML = "";

  visible.forEach((record) => {
    const node = recordTemplate.content.cloneNode(true);
    const card = node.querySelector(".record-card");
    const pill = node.querySelector(".pill");
    const date = node.querySelector(".date");
    const area = node.querySelector(".area");
    const team = node.querySelector(".team");
    const details = node.querySelector(".details");
    const photo = node.querySelector(".photo");

    card.dataset.id = record.id;
    pill.textContent = record.type;
    date.textContent = record.date;
    area.textContent = record.area;
    team.textContent = `Team: ${record.team}`;
    details.textContent = record.details;

    if (record.photo) {
      photo.src = record.photo;
      photo.hidden = false;
    } else {
      photo.hidden = true;
    }

    recordsList.appendChild(node);
  });

  emptyState.hidden = visible.length > 0;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const type = document.getElementById("record-type").value;
  const date = document.getElementById("record-date").value;
  const team = document.getElementById("record-team").value.trim();
  const area = document.getElementById("record-area").value.trim();
  const details = document.getElementById("record-details").value.trim();
  const photoFile = document.getElementById("record-photo").files[0];

  const photo = await toDataUrl(photoFile);
  const record = {
    id: crypto.randomUUID(),
    type,
    date,
    team,
    area,
    details,
    photo,
  };

  const records = loadRecords();
  records.unshift(record);
  saveRecords(records);

  form.reset();
  renderRecords();
});

filterType.addEventListener("change", renderRecords);
searchInput.addEventListener("input", renderRecords);

clearButton.addEventListener("click", () => {
  const ok = confirm("Delete all saved records from this browser?");
  if (!ok) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  renderRecords();
});

renderRecords();
