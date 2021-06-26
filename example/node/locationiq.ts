/* eslint-disable no-console */
import UniversalGeocoder from "UniversalGeocoder";

const locationIQGeocoder = UniversalGeocoder.createGeocoder({
  provider: "locationiq",
  apiKey: "api_key",
});

const asyncGeocode = async () => {
  const result = await locationIQGeocoder.geocode(
    "1600 Pennsylvania Ave NW, Washington, DC"
  );
  console.log("async geocode", result);
};
asyncGeocode();

const asyncGeodecode = async () => {
  const result = await locationIQGeocoder.geodecode("44.915", "-93.21");
  console.log("async geodecode", result);
};
asyncGeodecode();
