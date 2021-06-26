/* eslint-disable no-console */
import UniversalGeocoder from "UniversalGeocoder";

const yandexGeocoder = UniversalGeocoder.createGeocoder("yandex");

yandexGeocoder.geocode(
  { text: "1600 Pennsylvania Ave, Washington, DC", locale: "en-US" },
  (result) => {
    console.log("geocode", result);
  }
);
const asyncGeocode = async () => {
  const result = await yandexGeocoder.geocode(
    "1600 Pennsylvania Ave NW, Washington, DC"
  );
  console.log("async geocode", result);
};
asyncGeocode();

yandexGeocoder.geodecode(
  { coordinates: { latitude: "44.915", longitude: "-93.21" }, locale: "en-US" },
  (result) => {
    console.log("geodecode", result);
  }
);
const asyncGeodecode = async () => {
  const result = await yandexGeocoder.geodecode("44.915", "-93.21");
  console.log("async geodecode", result);
};
asyncGeodecode();
