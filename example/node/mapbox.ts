/* eslint-disable no-console */
import UniversalGeocoder from "UniversalGeocoder";

const mapboxGeocoder = UniversalGeocoder.createGeocoder({
  provider: "mapbox",
  apiKey: "api_key",
});

mapboxGeocoder.geocode("1600 Pennsylvania Ave NW, Washington, DC", (result) => {
  console.log("geocode", result);
});
const asyncGeocode = async () => {
  const result = await mapboxGeocoder.geocode(
    "1600 Pennsylvania Ave NW, Washington, DC"
  );
  console.log("async geocode", result);
};
asyncGeocode();

mapboxGeocoder.geodecode("44.915", "-93.21", (result) => {
  console.log("geodecode", result);
});
const asyncGeodecode = async () => {
  const result = await mapboxGeocoder.geodecode("44.915", "-93.21");
  console.log("async geodecode", result);
};
asyncGeodecode();
