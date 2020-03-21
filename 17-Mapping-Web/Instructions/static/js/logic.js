// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(queryUrl)

// Perform a GET request to the query URL
  d3.json(queryUrl, function(data) {    
    createFeatures(data.features);
  });
  function createFeatures(quakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup
    ("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"
      +"<hr><h3>Magnitude:  "+ feature.properties.mag + "</hr"
      
      );
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(quakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: colorRange(feature.properties.mag),
        color: "White",
        opacity: 1,
        weight: 1,
        fillOpacity: 0.5
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}
function colorRange(magnitude) {

  switch (true) {
    case magnitude >= 5.0:
      return 'Red';
      case magnitude >= 4.5:
      return 'Orangered';
    case magnitude >= 4.0:
      return 'Pink';
    case magnitude >= 3.5:
      return 'Gold';
     case magnitude >= 3.0:
      return 'Yellow';
    case magnitude >= 1.0:
      return 'Green';
    default:
      return 'Black';
  };
  };
  function markerSize(magnitude) {
return magnitude * 5;
  }
function createMap(earthquakes) {

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite" : satellite,
    "Grayscale" : grayscale,
    "Outdoors": outdoors
  };
// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.00, -95.00
  ],
  zoom: 4,
  layers: [grayscale, earthquakes]
});
// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

var legend = L.control({ position: 'topright' });

legend.onAdd = function (myMap) {

  var legendLocation = L.DomUtil.create('div', 'info legend'),
  levels = [0, 1, 2, 3, 4, 5]
    
  for (var i = 0; i < levels.length; i++) {
    legendLocation.innerHTML += '<i style="background:' + colorRange(levels[i]) + '"></i> ' + [i] + (levels[i + 1] ? '&ndash;' + 
      levels[i + 1] + '<br>' : '+');
  }
  return legendLocation;
};
legend.addTo(mymap);
  
  }


