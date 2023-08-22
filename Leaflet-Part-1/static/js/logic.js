// Part 1: Create the Earthquake Visualization.
// let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Create a map object
var myMap = L.map("map", {
    center: [37.7749, -122.4194], // Center of the map (you can adjust this to fit your data)
    zoom: 5
  });
  
  // Add a tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  d3.json(url).then(function(data) {
    // Call function to create markers
    createMarkers(data);
  });
  

  function createMarkers(data) {
    // Function to set marker size based on magnitude
    function markerSize(magnitude) {
      return magnitude * 10000;
    }
  
    // Function to set marker color based on depth
    function markerColor(depth) {
      // return light green if depth is less than 10
      if (depth < 10) return "#a3f600"; 
      // return yellow 
      else if (depth >= 10 && depth < 30) return "#dcf400";
      // Return light orange
      else if (depth >= 30 && depth < 50) return "#f7db11";
      // Return orange
      else if (depth >= 50 && depth < 70) return "#fdb72a";
      // Return light red
      else if (depth >= 70 && depth < 90) return "#fca35d";
      // Return red
      else if (depth >= 90) return "#FF0000";
    }

    // Loop through the data
    data.features.forEach(function(feature) {
      var magnitude = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];
      var place = feature.properties.place;
      // Create markers
      L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        fillOpacity: 1,
        color: "#2C2D2D",
        fillColor: markerColor(depth),
        radius: markerSize(magnitude)
      })
      .bindPopup("<h3>" + place + "</h3><hr><p>Magnitude: " + magnitude + "<br>Depth: " + depth + " km</p>")
      .addTo(myMap);
    });
  }


  // Create a legend control object

// Create a legend control object
var legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [-10, 10, 30, 50, 70, 90];
  var labels = ["-10-10 km", "10-30 km", "30-50 km", "50-70 km", "70-90 km", "90+ km"];
  var colors = ["#a3f600", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#FF0000"];

  // Style the legend background as white
  div.style.backgroundColor = '#FFFFFF';
  div.style.padding = '8px';
  div.style.border = '1px solid black';



  // Loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
    '<i style="background:' + colors[i] + '; width: 18px; height: 18px; float: left; margin-right: 8px;"></i> ' +
    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km<br>' : '+ km') + '<br>';
  }

  return div;
};

// Add the legend to the map
legend.addTo(myMap);




