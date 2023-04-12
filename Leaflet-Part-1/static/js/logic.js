// Create map object.
let myMap = L.map("map", {
  // Anchorage
  center: [61.217381, -149.863129],
  zoom: 8
});

// Create tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// add to my map
function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Control layers add to map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap)
  };

// Find endpoint for earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform GET request
d3.json(queryUrl).then(function (data) {
  // Log the data retrieved
  console.log(data);
  // Create features from data
  createFeatures(data.features);
});

// Define marker size
function markerSize(magnitude) {
  return magnitude * 4000
}

// Define marker color
function markerColor(depth) {
  if (depth > 90) return "indigo";
  else if (depth > 70) return "rebeccapurple";
  else if (depth > 50) return "slateblue";
  else if (depth > 30) return "violet";
  else if (depth > 10) return "thistle";
  else return "lavender";
}

// Create features function
function createFeatures(earthquakeData) {
  // Create popup function
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create GeoJSON layer that contains features array on earthquakeData object
  // Loop through each feature in array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    // Point to layer used to change markers
    pointToLayer: function(feature, latlng) {

      // Determine marker style
      var markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        opacity: 1,
        fillOpacity: .8
      }
      return L.circle(latlng,markers);
    }
  });

  // Send earthquakes layer to createMap function
  createMap(earthquakes);

// create map legend
  var legend = L.control({
    position: "bottomright"
  });
// Then add all the details for the legend
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "lavender",
      "thistle",
      "violet",
      "slateblue",
      "rebeccapurple",
      "indigo"
    ];
  // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

// Finally, we our legend to the map.
  legend.addTo(myMap);
};