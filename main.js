// main.js
const $ = (s) => document.querySelector(s);
const listEl = $("#list");
const statusEl = $("#status");
const venueSel = $("#venueSelect");
const qEl = $("#q");
const venueInfoEl = $("#venueInfo");

const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

async function loadJSON(path) {
  const r = await fetch(path, { cache: "no-store" });
  if (!r.ok) throw new Error(`${path} konnte nicht geladen werden`);
  return r.json();
}

function renderVenueInfo(venue) {
  if (!venue || !venue.id) {
    venueInfoEl.innerHTML = "Wähle einen Ort aus, um Details zu sehen.";
    return;
  }
  const lines = [
    venue.name,
    venue.address ? venue.address : null,
    (venue.lat != null && venue.lng != null) ? `Koordinaten: ${venue.lat}, ${venue.lng}` : null,
    venue.tags?.length ? `Tags: ${venue.tags.join(", ")}` : null
  ].filter(Boolean);
  venueInfoEl.innerHTML = `<p>${lines.join("<br>")}</p>`;
}

function renderEvents(items) {
  if (!items.length) {
    listEl.innerHTML = `<div class="empty">Keine Events gefunden.</div>`;
    return;
  }
  listEl.innerHTML = items.map(e => `
    <article class="event">
      <h3>${e.title}</h3>
      <div class="muted">${fmtDateTime(e.start)}</div>
      <div><strong>${e.venue.name}</strong>${e.venue.address ? " — " + e.venue.address : ""}</div>
      ${e.url ? `<div><a href="${e.url}" target="_blank" rel="noopener">Mehr&nbsp;Infos</a></div>` : ""}
    </article>
    <hr style="border:none;border-top:1px solid #eee;margin:10px 0"/>
  `).join("");
}

function fuse(venues, events) {
  const byId = Object.fromEntries(venues.map(v => [v.id, v]));
  return events
    .map(e => ({ ...e, venue: byId[e.venueId] }))
    .filter(e => !!e.venue)
    .sort((a, b) => new Date(a.start) - new Date(b.start));
}

function applyFilters(all, venues) {
  const v = venueSel.value.trim();
  const q = qEl.value.trim().toLowerCase();
  const filtered = all.filter(e => {
    const venueMatch = !v || e.venue.id === v;
    const text = `${e.title} ${e.venue.name} ${e.venue.address ?? ""}`.toLowerCase();
    const searchMatch = !q || text.includes(q);
    return venueMatch && searchMatch;
  });
  // Venue-Info aktualisieren
  renderVenueInfo(venues.find(x => x.id === v));
  return filtered;
}

async function init() {
  try {
    statusEl.textContent = "Lade Daten …";
    const [venues, events] = await Promise.all([
      loadJSON("./data/venues.json"),
      loadJSON("./data/events.json")
    ]);

    // Venue-Dropdown
    venueSel.insertAdjacentHTML("beforeend",
      venues.map(v => `<option value="${v.id}">${v.name}</option>`).join("")
    );

    const merged = fuse(venues, events);
    renderEvents(merged);
    statusEl.textContent = "";

    const update = () => renderEvents(applyFilters(merged, venues));
    venueSel.addEventListener("change", update);
    qEl.addEventListener("input", update);
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Fehler: " + e.message;
  }
}

init();
