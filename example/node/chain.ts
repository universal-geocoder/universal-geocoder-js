/* eslint-disable no-console */
import UniversalGeocoder from "UniversalGeocoder";

const yandexGeocoder = UniversalGeocoder.createGeocoder("yandex");
const openStreetMapGeocoder = UniversalGeocoder.createGeocoder({
  provider: "openstreetmap",
  userAgent: "Universal Geocoder Example",
});
const chainGeocoder = UniversalGeocoder.createGeocoder({
  provider: "chain",
  providers: [yandexGeocoder, openStreetMapGeocoder],
  parallelize: true,
});

chainGeocoder.geocode("1600 Pennsylvania Ave, Washington, DC", (result) => {
  console.log("geocode", result);
});
const asyncGeocode = async () => {
  const result = await chainGeocoder.geocode(
    "1600 Pennsylvania Ave NW, Washington, DC"
  );
  console.log("async geocode", result);
};
asyncGeocode();

chainGeocoder.geodecode("44.915", "-93.21", (result) => {
  console.log("geodecode", result);
});
const asyncGeodecode = async () => {
  const result = await chainGeocoder.geodecode("44.915", "-93.21");
  console.log("async geodecode", result);
};
asyncGeodecode();
