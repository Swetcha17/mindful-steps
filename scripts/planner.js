function handleSearch() {
  const start = document.getElementById("start-point")?.value;
  const dest = document.getElementById("destination-point")?.value;
  const mode = document.getElementById("mode")?.value;

  if (!start || !dest) {
    alert("Please select both start and destination.");
    return;
  }

  alert(`Generating route from ${start} to ${dest} by ${mode}`);
}

function scrollToMap() {
  const section = document.getElementById("map-section");
  if (section) section.scrollIntoView({ behavior: "smooth" });
}

function activateMap() {
  const iframe = document.getElementById("map-embed");
  const cover = document.getElementById("map-cover");
  if (iframe) iframe.style.pointerEvents = "auto";
  if (cover) cover.style.display = "none";
}

const captions = document.querySelectorAll(".caption");
const planner = document.getElementById("planner");

if (planner) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.5 });

  captions.forEach((c) => observer.observe(c));
  observer.observe(planner);
}

window.handleSearch = handleSearch;
window.scrollToMap = scrollToMap;
window.activateMap = activateMap;
