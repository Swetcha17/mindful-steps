let map = L.map('map').setView([40.6075, -75.3770], 16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let userMarker, routeLayer;

window.generateLoopRoute = async function () {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const time = parseInt(document.getElementById("walk-time").value);
    const level = document.getElementById("walk-difficulty").value;

    const avgSpeed = level === "easy" ? 1.0 : level === "medium" ? 1.3 : 1.6; // m/s
    const distance = (time * 60 * avgSpeed).toFixed(1); // in meters

    const angle1 = Math.random() * 360;
    const angle2 = angle1 + 180;
    const radius = distance / 2 / 111320; // approx degrees

    const wp1 = [
      lat + radius * Math.cos(angle1 * Math.PI / 180),
      lng + radius * Math.sin(angle1 * Math.PI / 180)
    ];
    const wp2 = [
      lat + radius * Math.cos(angle2 * Math.PI / 180),
      lng + radius * Math.sin(angle2 * Math.PI / 180)
    ];

    const coordinates = [[lng, lat], [wp1[1], wp1[0]], [wp2[1], wp2[0]], [lng, lat]];

    const body = { coordinates };
    const res = await fetch("https://api.openrouteservice.org/v2/directions/foot-walking/geojson", {
      method: "POST",
      headers: {
        Authorization: "5b3ce3597851110001cf624864a06efbecaa4a48a93c8f73f9fa0b07",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!data.features || !data.features.length) {
      alert("No route found.");
      return;
    }

    if (routeLayer) map.removeLayer(routeLayer);
    if (userMarker) map.removeLayer(userMarker);

    userMarker = L.marker([lat, lng]).addTo(map).bindPopup("Start / End").openPopup();
    routeLayer = L.geoJSON(data).addTo(map);
    map.fitBounds(routeLayer.getBounds());

    const summary = data.features[0].properties.summary;
    alert(`Distance: ${(summary.distance / 1000).toFixed(2)} km\nDuration: ${(summary.duration / 60).toFixed(1)} mins`);
  }, () => {
    alert("Unable to get your location.");
  });
};
