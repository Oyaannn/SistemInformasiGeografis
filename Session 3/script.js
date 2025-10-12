
const center = [-6.9051, 106.8709];
const zoom = 15;

// === MAP 1: Default (EPSG:3857) ===
const map1 = L.map('map1').setView(center, zoom);
const osm3857 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map1);

// === MAP 2: EPSG:4326 dengan OSM-WMS ===
const map2 = L.map('map2', {
  crs: L.CRS.EPSG4326,
  center: center,
  zoom: zoom
});

// Gunakan WMS dari OSM (disediakan oleh bbbike.org)
const osmWms = L.tileLayer.wms('https://ows.terrestris.de/osm/service?', {
  layers: 'OSM-WMS',
  format: 'image/png',
  transparent: false,
  version: '1.1.1',
  attribution: 'Map data © OpenStreetMap contributors, terrestris GmbH & Co. KG',
  crs: L.CRS.EPSG4326
}).addTo(map2);

// === Tambahkan GeoJSON ke kedua peta ===
function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup("<b>" + feature.properties.name + "</b>");
  }
}

fetch('map.geojson')
  .then(res => res.json())
  .then(data => {
    const layer1 = L.geoJSON(data, { onEachFeature }).addTo(map1);
    const layer2 = L.geoJSON(data, { onEachFeature }).addTo(map2);
    map1.fitBounds(layer1.getBounds());
    map2.fitBounds(layer2.getBounds());
  })
  .catch(err => console.error("Gagal memuat map.geojson:", err));

// Tambahkan skala ke kedua peta
L.control.scale({ position: "bottomleft" }).addTo(map1);
L.control.scale({ position: "bottomleft" }).addTo(map2);
