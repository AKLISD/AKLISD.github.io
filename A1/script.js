// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken = 'pk.eyJ1IjoieHVlZmVuZzkzNTczODc3MiIsImEiOiJjbDA4N3JueXAwMHQ2M29ueW1oODN6bmozIn0.D9D3L0dRBdI-fmr6zo7HxQ'; 
    const map = new mapboxgl.Map({
      container: 'map',
      // Replace YOUR_STYLE_URL with your style URL.
      style: 'mapbox://styles/xuefeng935738772/cl0zb8s9j000l15jzsa6ajzyr', 
      center: [-3.6360, 56.2781],
      zoom: 6.25
    });
    map.on ('click', (event) => {
    const features = map.queryRenderedFeatures(event.point, {
    layers: ['heat-networks']
    });
    if (!features.length) {
return;
}
const feature = features[0];
     
      //Fly to the point when click.
  map.flyTo({
    center: feature.geometry.coordinates, //keep this
    zoom: 16 //change fly to zoom level
  });
 
const popup = new mapboxgl.Popup({ offset: [0, 0] })
.setLngLat(feature.geometry.coordinates)
.setHTML(
 `<h3>Status:${feature.properties.Status}</h3>
 <p>PrimaryFuel：${feature.properties.PrimaryFuel}</p>
 <p>PrimaryTechnology：${feature.properties.PrimaryTechnology}</p>
 <p>SizeCategory：${feature.properties.SizeCategory}</p>
 <p>project_name：${feature.properties.project_name}</p>
 `
)
.addTo(map);
});


map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-left"
);

map.on("load", () => {
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.
  map.addSource("Heat_Networks_1", {
    type: "geojson", //keep this
    // Point to GeoJSON data. You can get an URL of your data uploaded to Mapbox
    // by replacing the access_token and the user name and the dataset id
    // https://api.mapbox.com/datasets/v1/<username>/<datasetid>/features/?access_token=<accesstoken>
    data:
      "https://api.mapbox.com/datasets/v1/xuefeng935738772/cl0zb5zn50o4g21m40n9shsbo/features/?access_token=pk.eyJ1IjoieHVlZmVuZzkzNTczODc3MiIsImEiOiJjbDA4N3JueXAwMHQ2M29ueW1oODN6bmozIn0.D9D3L0dRBdI-fmr6zo7HxQ",

    cluster: true, //keep this
    clusterMaxZoom: 9, // Max zoom to cluster points on, no cluster beyond this zoom level
    generateId: true, //keep this
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    id: "clusters", //keep this
    type: "circle", //keep this
    source: "Heat_Networks_1", //match the source name to the data source you added above
    filter: ["has", "point_count"], //keep this
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 10
      //   * Yellow, 25px circles when point count is between 10 and 20
      //   * Pink, 30px circles when point count is greater than or equal to 20
      "circle-color": [
        "step",
        ["get", "point_count"],
        "lightblue",
        10,
        "lightyellow",
        20,
        "pink"
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 10, 25, 20, 30]
    }
  });

  map.addLayer({
    id: "cluster-count", //keep this
    type: "symbol", //keep this
    source: "Heat_Networks_1", //match the source name to the data source you added above
    filter: ["has", "point_count"], //keep this
    layout: {
      "text-field": "{point_count_abbreviated}", //keep this
      //you can change the font and size
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12
    }
  });
});

map.addControl(new mapboxgl.NavigationControl(), "top-left");