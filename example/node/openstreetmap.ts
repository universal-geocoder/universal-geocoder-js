/* eslint-disable no-console */
import UniversalGeocoder from "../../dist/UniversalGeocoder";

const openStreetMapGeocoder = UniversalGeocoder.createGeocoder({
  provider: "openstreetmap",
  userAgent: "Universal Geocoder Example",
});

openStreetMapGeocoder.geocode(
  "1600 Pennsylvania Ave NW, Washington, DC",
  (result) => {
    console.log("geocode", result);
  }
);
const asyncGeocode = async () => {
  const result = await openStreetMapGeocoder.geocode(
    "1600 Pennsylvania Ave NW, Washington, DC"
  );
  console.log("async geocode", result);
};
asyncGeocode();

openStreetMapGeocoder.geodecode("44.915", "-93.21", (result) => {
  console.log("geodecode", result);
});
const asyncGeodecode = async () => {
  const result = await openStreetMapGeocoder.geodecode("44.915", "-93.21");
  console.log("async geodecode", result);
};
asyncGeodecode();
