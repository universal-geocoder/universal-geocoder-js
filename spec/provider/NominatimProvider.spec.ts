import UniversalGeocoder from "UniversalGeocoder";
import {
  NominatimGeocoded,
  NominatimGeocodeQuery,
  NominatimReverseQuery,
  OpenStreetMapProvider,
} from "provider";
import ExternalLoader from "ExternalLoader";
import AdminLevel from "AdminLevel";
import setupPolly, { cleanRecording } from "../setupPolly";

describe("OpenStreetMap / Nominatim Geocoder Provider", () => {
  const pollyContext = setupPolly();

  beforeEach(() => {
    cleanRecording(pollyContext);
  });

  afterEach(async () => {
    await pollyContext.polly.flush();
  });

  it("expects User-Agent to be required on initiation", () => {
    expect(() => new OpenStreetMapProvider(new ExternalLoader())).toThrowError(
      Error,
      'An User-Agent identifying your application is required for the OpenStreetMap / Nominatim provider when using the default host. Please add it in the "userAgent" option.'
    );
  });

  it("expects to not support IP geolocation", () => {
    const provider = UniversalGeocoder.createGeocoder({
      provider: "nominatim",
      useSsl: true,
      userAgent: "Universal Geocoder Example",
    });

    expect(() =>
      provider.geocode(
        "66.147.244.214",
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      )
    ).toThrowError(
      Error,
      "The OpenStreetMap / Nominatim provider does not support IP geolocation, only location geocoding."
    );
  });

  it("receives correct geocoding results", (done) => {
    const provider = UniversalGeocoder.createGeocoder({
      provider: "nominatim",
      useSsl: true,
      userAgent: "Universal Geocoder Example",
    });

    provider.geocode(
      NominatimGeocodeQuery.create({
        text: "1600 Pennsylvania Ave, Washington, DC",
        shape: "geojson",
      }),
      (results: NominatimGeocoded[]) => {
        const geocoded = results[0];

        expect(geocoded).toBeDefined();
        expect(geocoded.getCoordinates()).toEqual({
          latitude: 38.895806,
          longitude: -77.0305572,
        });
        expect(geocoded.getBounds()).toEqual({
          latitudeSW: 38.8957792,
          longitudeSW: -77.0306691,
          latitudeNE: 38.8958368,
          longitudeNE: -77.030466,
        });
        expect(geocoded.getFormattedAddress()).toEqual(undefined);
        expect(geocoded.getDisplayName()).toEqual(
          "Pennsylvania Avenue, Washington, District of Columbia, 20045, United States"
        );
        expect(geocoded.getStreetNumber()).toEqual(undefined);
        expect(geocoded.getStreetName()).toEqual("Pennsylvania Avenue");
        expect(geocoded.getSubLocality()).toEqual(undefined);
        expect(geocoded.getLocality()).toEqual("Washington");
        expect(geocoded.getSubLocalityLevels()).toEqual([
          AdminLevel.create({ level: 5, name: "Pennsylvania Avenue" }),
        ]);
        expect(geocoded.getPostalCode()).toEqual("20045");
        expect(geocoded.getRegion()).toEqual("District of Columbia");
        expect(geocoded.getAdminLevels()).toEqual([
          AdminLevel.create({ level: 1, name: "District of Columbia" }),
        ]);
        expect(geocoded.getCountry()).toEqual("United States");
        expect(geocoded.getCountryCode()).toEqual("us");
        expect(geocoded.getOsmId()).toEqual(899927550);
        expect(geocoded.getOsmType()).toEqual("way");
        expect(geocoded.getCategories()).toEqual(["highway"]);
        expect(geocoded.getTypes()).toEqual(["path"]);
        expect(geocoded.getAttribution()).toEqual(
          "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright"
        );
        expect(geocoded.getShape()).toEqual({
          type: "LineString",
          coordinates: [
            [-77.030466, 38.8957792],
            [-77.0305048, 38.8957916],
            [-77.0305134, 38.895794],
            [-77.0305287, 38.8957982],
            [-77.0305412, 38.8958016],
            [-77.0305572, 38.895806],
            [-77.0306007, 38.895818],
            [-77.0306244, 38.8958246],
            [-77.0306691, 38.8958368],
          ],
        });

        done();
      }
    );
  });

  it("receives correct geodecoding results", (done) => {
    const provider = UniversalGeocoder.createGeocoder({
      provider: "nominatim",
      useSsl: true,
      userAgent: "Universal Geocoder Example",
    });

    provider.geodecode(
      NominatimReverseQuery.create({
        coordinates: { latitude: 48.8631507, longitude: 2.388911 },
        shape: "kml",
      }),
      (results: NominatimGeocoded[]) => {
        const geocoded = results[0];

        expect(geocoded).toBeDefined();
        expect(geocoded.getCoordinates()).toEqual({
          latitude: 48.863065,
          longitude: 2.38873,
        });
        expect(geocoded.getBounds()).toEqual({
          latitudeSW: 48.863015,
          longitudeSW: 2.38868,
          latitudeNE: 48.863115,
          longitudeNE: 2.38878,
        });
        expect(geocoded.getFormattedAddress()).toEqual(undefined);
        expect(geocoded.getDisplayName()).toEqual(
          "Zebra, Avenue Gambetta, Quartier du Père-Lachaise, Paris 20e Arrondissement, Paris, Île-de-France, France métropolitaine, 75020, France"
        );
        expect(geocoded.getStreetNumber()).toEqual(undefined);
        expect(geocoded.getStreetName()).toEqual("Avenue Gambetta");
        expect(geocoded.getSubLocality()).toEqual("Paris 20e Arrondissement");
        expect(geocoded.getLocality()).toEqual("Paris");
        expect(geocoded.getSubLocalityLevels()).toEqual([
          AdminLevel.create({ level: 1, name: "Paris 20e Arrondissement" }),
          AdminLevel.create({ level: 3, name: "Quartier du Père-Lachaise" }),
          AdminLevel.create({ level: 5, name: "Avenue Gambetta" }),
        ]);
        expect(geocoded.getPostalCode()).toEqual("75020");
        expect(geocoded.getRegion()).toEqual("Île-de-France");
        expect(geocoded.getAdminLevels()).toEqual([
          AdminLevel.create({ level: 1, name: "Île-de-France" }),
          AdminLevel.create({ level: 2, name: "Paris" }),
        ]);
        expect(geocoded.getCountry()).toEqual("France");
        expect(geocoded.getCountryCode()).toEqual("fr");
        expect(geocoded.getOsmId()).toEqual(3394657795);
        expect(geocoded.getOsmType()).toEqual("node");
        expect(geocoded.getCategories()).toEqual(["amenity"]);
        expect(geocoded.getTypes()).toEqual(["driving_school"]);
        expect(geocoded.getAttribution()).toEqual(
          "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright"
        );
        expect(geocoded.getShape()).toEqual(
          "<Point><coordinates>2.38873,48.863065</coordinates></Point>"
        );

        done();
      }
    );
  });
});
