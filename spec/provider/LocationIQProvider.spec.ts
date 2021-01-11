import UniversalGeocoder from "UniversalGeocoder";
import { LocationIQGeocoded, LocationIQProvider } from "provider";
import ExternalLoader from "ExternalLoader";
import AdminLevel from "AdminLevel";
import setupPolly, { cleanRecording } from "../setupPolly";

describe("LocationIQ Geocoder Provider", () => {
  const pollyContext = setupPolly();

  beforeEach(() => {
    cleanRecording(pollyContext);
  });

  afterEach(async () => {
    await pollyContext.polly.flush();
  });

  it("expects API Key to be required on initiation", () => {
    expect(() => new LocationIQProvider(new ExternalLoader())).toThrowError(
      Error,
      'An API key is required for the LocationIQ provider. Please add it in the "apiKey" option.'
    );
  });

  it("expects to not support IP geolocation", () => {
    const provider = UniversalGeocoder.createGeocoder({
      provider: "locationiq",
      useSsl: true,
      apiKey: "api_key",
    });

    expect(() =>
      provider?.geocode(
        "66.147.244.214",
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      )
    ).toThrowError(
      Error,
      "The LocationIQ provider does not support IP geolocation, only location geocoding."
    );
  });

  it("receives correct geocoding results", (done) => {
    const provider = UniversalGeocoder.createGeocoder({
      provider: "locationiq",
      useSsl: true,
      apiKey: "api_key",
    });

    provider?.geocode(
      "1600 Pennsylvania Ave, Washington, DC",
      (results: LocationIQGeocoded[]) => {
        const geocoded = results[0];

        expect(geocoded).toBeDefined();
        expect(geocoded.getCoordinates()).toEqual({
          latitude: 38.8636383,
          longitude: -76.9463651,
        });
        expect(geocoded.getBounds()).toEqual({
          latitudeSW: 38.8633822,
          longitudeSW: -76.9467576,
          latitudeNE: 38.8637409,
          longitudeNE: -76.945632,
        });
        expect(geocoded.getFormattedAddress()).toEqual(undefined);
        expect(geocoded.getDisplayName()).toEqual(
          "Pennsylvania Avenue, Coral Hills, Prince George's County, Washington, D.C., dc, 20743, USA"
        );
        expect(geocoded.getStreetNumber()).toEqual(undefined);
        expect(geocoded.getStreetName()).toEqual("Pennsylvania Avenue");
        expect(geocoded.getSubLocality()).toEqual(undefined);
        expect(geocoded.getLocality()).toEqual("Coral Hills");
        expect(geocoded.getSubLocalityLevels()).toEqual([
          AdminLevel.create({ level: 3, name: "Pennsylvania Avenue" }),
        ]);
        expect(geocoded.getPostalCode()).toEqual("20743");
        expect(geocoded.getRegion()).toEqual("Washington, D.C.");
        expect(geocoded.getAdminLevels()).toEqual([
          AdminLevel.create({ level: 1, name: "Washington, D.C.", code: "dc" }),
          AdminLevel.create({ level: 2, name: "Prince George's County" }),
        ]);
        expect(geocoded.getCountry()).toEqual("United States of America");
        expect(geocoded.getCountryCode()).toEqual("us");
        expect(geocoded.getPlaceId()).toEqual("176084648");
        expect(geocoded.getOsmId()).toEqual("397325778");
        expect(geocoded.getOsmType()).toEqual("way");
        expect(geocoded.getCategories()).toEqual(["highway"]);
        expect(geocoded.getTypes()).toEqual(["trunk"]);
        expect(geocoded.getPrecision()).toEqual("street");
        expect(geocoded.getPrecisionCode()).toEqual("fallback");
        expect(geocoded.getPrecisionType()).toEqual("centroid");
        expect(geocoded.getAttribution()).toEqual(
          "https://locationiq.com/attribution"
        );

        done();
      }
    );
  });

  it("receives correct geodecoding results", (done) => {
    const provider = UniversalGeocoder.createGeocoder({
      provider: "locationiq",
      useSsl: true,
      apiKey: "api_key",
    });

    provider?.geodecode(
      48.8631507,
      2.388911,
      (results: LocationIQGeocoded[]) => {
        const geocoded = results[0];

        expect(geocoded).toBeDefined();
        expect(geocoded.getCoordinates()).toEqual({
          latitude: 48.86374155,
          longitude: 2.39115310745945,
        });
        expect(geocoded.getBounds()).toEqual({
          latitudeSW: 48.8625929,
          longitudeSW: 2.3877078,
          latitudeNE: 48.8648832,
          longitudeNE: 2.3956964,
        });
        expect(geocoded.getFormattedAddress()).toEqual("75020, Paris, France");
        expect(geocoded.getDisplayName()).toEqual(
          "Quartier du Père-Lachaise, Paris, Paris, Ile-de-France, 75020, France"
        );
        expect(geocoded.getStreetNumber()).toEqual(undefined);
        expect(geocoded.getStreetName()).toEqual(undefined);
        expect(geocoded.getSubLocality()).toEqual("Quartier du Père-Lachaise");
        expect(geocoded.getLocality()).toEqual("Paris");
        expect(geocoded.getSubLocalityLevels()).toEqual([
          AdminLevel.create({ level: 1, name: "Quartier du Père-Lachaise" }),
        ]);
        expect(geocoded.getPostalCode()).toEqual("75020");
        expect(geocoded.getRegion()).toEqual("Ile-de-France");
        expect(geocoded.getAdminLevels()).toEqual([
          AdminLevel.create({ level: 1, name: "Ile-de-France" }),
          AdminLevel.create({ level: 2, name: "Paris" }),
        ]);
        expect(geocoded.getCountry()).toEqual("France");
        expect(geocoded.getCountryCode()).toEqual("fr");
        expect(geocoded.getPlaceId()).toEqual("164303806");
        expect(geocoded.getOsmId()).toEqual("322777831");
        expect(geocoded.getOsmType()).toEqual("way");
        expect(geocoded.getCategories()).toEqual([]);
        expect(geocoded.getTypes()).toEqual([]);
        expect(geocoded.getDistance()).toEqual(176);
        expect(geocoded.getAttribution()).toEqual(
          "https://locationiq.com/attribution"
        );

        done();
      }
    );
  });

  it("receives error when the API key is bad", (done) => {
    const provider = UniversalGeocoder.createGeocoder({
      provider: "locationiq",
      useSsl: true,
      apiKey: "api_key",
    });

    provider?.geocode(
      "1600 Pennsylvania Ave, Washington, DC",
      () => {
        done();
      },
      (error) => {
        expect(error.message).toEqual(
          "Received HTTP status code 401 when attempting geocoding request."
        );
        done();
      }
    );
  });
});
