const mapElement = document.getElementById("map");

if (mapElement) {
    const lat = Number(mapElement.dataset.lat);
    const lng = Number(mapElement.dataset.lng);

    console.log("Latitude:", lat);
    console.log("Longitude:", lng);

    const map = L.map("map").setView([lat, lng], 13);

    map.addLayer(L.maplibreGL({
        style: "https://tiles.openfreemap.org/styles/liberty",
    }));

    const title = mapElement.dataset.title;
    const location = mapElement.dataset.location;
    const country = mapElement.dataset.country;

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`
        <strong>${title}</strong><br>
        ${location}, ${country}
    `)
        .openPopup();
}