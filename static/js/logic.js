document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map
    var map = L.map('map').setView([0, 0], 2);

    // Add base map layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // URL for fetching earthquake data
    var earthquakeUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-12-28&endtime=2024-01-04&minmagnitude=4';
    var tectonicPlatesUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

    // Fetch earthquake data
    fetch(earthquakeUrl)
        .then(response => response.json())
        .then(data => {
            // Plot earthquakes
            data.features.forEach(feature => {
                var coordinates = feature.geometry.coordinates;
                var magnitude = feature.properties.mag;
                var depth = coordinates[2]; // Depth is the third coordinate

                // Define marker size and color based on magnitude and depth
                var markerOptions = {
                    radius: magnitude * 2,
                    fillColor: getColor(depth),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };

                // Create marker and bind popup
                L.circleMarker([coordinates[1], coordinates[0]], markerOptions)
                    .bindPopup('Magnitude: ' + magnitude + '<br>Depth: ' + depth)
                    .addTo(map);
            });
        });

    // Fetch tectonic plates data
    fetch(tectonicPlatesUrl)
        .then(response => response.json())
        .then(platesData => {
            // Plot tectonic plates
            L.geoJSON(platesData, {
                style: function (feature) {
                    return {
                        color: 'orange', // Color of tectonic plate boundaries
                        weight: 2,
                        opacity: 1
                    };
                }
            }).addTo(map);
        });

    // Create legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<h4>Depth</h4>';
        div.innerHTML += '<i style="background: #FF69B4"></i> Shallow<br>';
        div.innerHTML += '<i style="background: #8A2BE2"></i> Intermediate<br>';
        div.innerHTML += '<i style="background: #4B0082"></i> Deep<br>';
        div.innerHTML += '<hr>';
        div.innerHTML += '<h4>Tectonic Plates</h4>';
        div.innerHTML += '<i style="background: orange"></i> Tectonic Plate Boundaries<br>';
        return div;
    };
    legend.addTo(map);

    // Function to determine marker color based on depth
    function getColor(depth) {
        if (depth < 70) {
            return '#FF69B4'; // Pink
        } else if (depth < 300) {
            return '#8A2BE2'; // Violet
        } else {
            return '#4B0082'; // Indigo
        }
    }
});
