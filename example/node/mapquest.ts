/* eslint-disable no-console */
import UniversalGeocoder from "../../dist/UniversalGeocoder";
import Geocoded from "../../dist/Geocoded";
import { MapQuestGeocodeQuery, MapQuestLocation } from "../../dist/provider";

let mapQuestGeocoder = UniversalGeocoder.createGeocoder({
  provider: "mapquest",
});

mapQuestGeocoder.geocode(
  "1600 Pennsylvania Ave NW, Washington, DC",
  (result) => {
    console.log("geocode", result);
  }
);
const asyncGeocode = async () => {
  const result = await mapQuestGeocoder.geocode(
    "1600 Pennsylvania Ave NW, Washington, DC"
  );
  console.log("async geocode", result);
};
asyncGeocode();

mapQuestGeocoder.geodecode("44.915", "-93.21", (result) => {
  console.log("geodecode", result);
});
const asyncGeodecode = async () => {
  const result = await mapQuestGeocoder.geodecode("44.915", "-93.21");
  console.log("async geodecode", result);
};
asyncGeodecode();

mapQuestGeocoder.geocode(
  MapQuestGeocodeQuery.create({
    location: Geocoded.create({
      streetNumber: 1600,
      streetName: "Pennsylvania Ave NW",
      locality: "Washington",
    }),
  }),
  (result) => {
    console.log("geocode location", result);
  }
);

mapQuestGeocoder = UniversalGeocoder.createGeocoder({
  provider: "mapquest",
  apiKey: "Fmjtd|luurnu6al1,bg=o5-9wbg94",
  method: "POST",
  openDomain: true,
});

mapQuestGeocoder.geocode(
  "1600 Pennsylvania Ave NW, Washington, DC",
  (result) => {
    console.log("geocode POST", result);
  }
);

mapQuestGeocoder.geodecode("44.915", "-93.21", (result) => {
  console.log("geodecode POST", result);
});

mapQuestGeocoder.geocode(
  MapQuestGeocodeQuery.create({
    location: MapQuestLocation.create({
      street: "1600 Pennsylvania Ave NW",
      city: "Washington",
    }),
  }),
  (result) => {
    console.log("geocode POST location", result);
  }
);
