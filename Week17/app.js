// datasets:
var significantEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
var m4_5PlusEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
var m2_5PlusEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
var m1PlusEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"
var allEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


var significantEarthquakesData = getData(significantEarthquakes);
var m4_5PlusEarthquakesData = getData(m4_5PlusEarthquakes);
var m2_5PlusEarthquakesData = getData(m2_5PlusEarthquakes);
var m1PlusEarthquakesData = getData(m1PlusEarthquakes);
var allEarthquakesData = getData(allEarthquakes);

function getData(queryUrl) {
    d3.json(queryUrl, function(data) {
        console.log(data.features)
        return data.features
  });
}

var significantEarthquakesLayer = createLayer(significantEarthquakesData);
var m4_5PlusEarthquakesLayer = createLayer(m4_5PlusEarthquakesData);
var m2_5PlusEarthquakesLayer = createLayer(m2_5PlusEarthquakesData);
var m1PlusEarthquakesLayer = createLayer(m1PlusEarthquakesData);
var allEarthquakesLayer = createLayer(allEarthquakesData);

function createLayer(features) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.title +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      }
    var layer = L.geoJSON(features, {
        onEachFeature: onEachFeature
    });
    console.log(layer)
    console.log("*******************")
    return layer;
}



console.log(m4_5PlusEarthquakesLayer); //addTo(myMap);
// console.log(overlayMaps["Significant Earthquakes"]); //addTo(myMap);

var overlayMaps = {
    "Significant Earthquakes": significantEarthquakesLayer,
    "M4.5+ Earthquakes": m4_5PlusEarthquakesLayer,
    "M2.5+ Earthquakes": m2_5PlusEarthquakesLayer,
    "M1.0+ Earthquakes": m1PlusEarthquakesLayer,
    "All Earthquakes": allEarthquakesLayer
  };

  var pencil = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.pencil",
    accessToken: API_KEY
    });
    
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
    });
    
var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
    });

var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
    layers: [dark]
    });

function createMap(earthquakes) {
    
    var baseMaps = {
        Pencil: pencil,
        Light: light,
        Dark: dark
        };
        
    // Overlays that may be toggled on or off
    myMap.addLayer(earthquakes);

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

console.log(myMap); //addTo(myMap);
}

createMap(significantEarthquakesLayer); 





// var seMarkers = [];

// for (var i = 0; i < significantEarthquakes.features.length; i++) {
//   // loop through the dataset, create a new marker, push it to the markers array
//     var lat = significantEarthquakes.features[i].geometry.coordinates[0]
//     var lon = significantEarthquakes.features[i].geometry.coordinates[1]
//     var location = [lat,lon]

//     var title = significantEarthquakes.features[i].properties.title

//   seMarkers.push(
//     L.marker(location).bindPopup("<h2>" + title + "</h2>")
//   );
// }

// var significantEarthquakesLayer = L.layerGroup(seMarkers);


// // Only one base layer can be shown at a time


//   var myMap = L.map("map", {
//     center: [46.2276, 2.2137],
//     zoom: 6,
//     layers: [light, significantEarthquakesLayer]
//   });

//   L.control.layers(baseMaps, overlayMaps).addTo(myMap);
