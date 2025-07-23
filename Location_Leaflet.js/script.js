let map = L.map("map").setView([21.1702, 72.8311], 13); // Surat by default
let routingControl;
let userMarker;

// Tile Layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Get current location
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    const userLatLng = [latitude, longitude];
    map.setView(userLatLng, 14);

    userMarker = L.marker(userLatLng).addTo(map).bindPopup("You are here").openPopup();
  },
  () => {
    alert("Could not get your location. Using default location.");
  }
);

// Search function
function searchLocation() {
  const query = document.getElementById("locationInput").value;

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        alert("Location not found!");
        return;
      }

      const { lat, lon, display_name } = data[0];
      const destination = [parseFloat(lat), parseFloat(lon)];

      L.marker(destination).addTo(map).bindPopup(display_name).openPopup();
      map.setView(destination, 14);
    });
}

// Trace route
function getRouteToDestination() {
  const query = document.getElementById("locationInput").value;

  if (!query) {
    alert("Please enter a location to trace the route.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLatLng = [position.coords.latitude, position.coords.longitude];

      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) {
            alert("Destination not found!");
            return;
          }

          const destination = [parseFloat(data[0].lat), parseFloat(data[0].lon)];

          // Remove previous route
          if (routingControl) {
            map.removeControl(routingControl);
          }

          routingControl = L.Routing.control({
            waypoints: [
              L.latLng(userLatLng[0], userLatLng[1]),
              L.latLng(destination[0], destination[1])
            ],
            routeWhileDragging: false,
          }).addTo(map);
        });
    },
    () => {
      alert("Could not get your location.");
    }
  );
}
