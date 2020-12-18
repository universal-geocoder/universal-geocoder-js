/* eslint-disable no-console */
import UniversalGeocoder from "../../dist/cjs/UniversalGeocoder";

const googleGeocoder = UniversalGeocoder.createGeocoder({
  provider: "googlemaps",
  useSsl: true,
});

googleGeocoder.geocode("1600 Pennsylvania Ave, Washington, DC", (result) => {
  console.log("geocode", result);
});
const asyncGeocode = async () => {
  const result = await googleGeocoder.geocode(
    "1600 Pennsylvania Ave NW, Washington, DC"
  );
  console.log("async geocode", result);
};
asyncGeocode();

googleGeocoder.geodecode("44.915", "-93.21", (result) => {
  console.log("geodecode", result);
});
const asyncGeodecode = async () => {
  const result = await googleGeocoder.geodecode("44.915", "-93.21");
  console.log("async geodecode", result);
};
asyncGeodecode();
