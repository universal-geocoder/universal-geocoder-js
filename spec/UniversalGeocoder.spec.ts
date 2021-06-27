import UniversalGeocoder, { GeocoderName } from "UniversalGeocoder";

describe("Universal Geocoder main module", () => {
  it("can geocode with a specified geocoder", (done) => {
    const useGeocoder = () =>
      UniversalGeocoder.createGeocoder({
        provider: "nominatim",
        useSsl: true,
        userAgent: "Universal Geocoder Example",
      });
    const geocoder = useGeocoder();
    expect(geocoder).toBeDefined();
    geocoder.geocode("1600 Pennsylvania Ave, Washington, DC", (results) => {
      expect(results).toBeDefined();
      done();
    });
  });

  it("can geocode with an unspecified geocoder", (done) => {
    const useGeocoder = (geocoderName: string) =>
      UniversalGeocoder.createGeocoder({
        provider: geocoderName,
        useSsl: true,
        userAgent: "Universal Geocoder Example",
      });
    const geocoder = useGeocoder("nominatim");
    expect(geocoder).toBeDefined();
    geocoder?.geocode("1600 Pennsylvania Ave, Washington, DC", (results) => {
      expect(results).toBeDefined();
      done();
    });
  });

  it("can geocode with a restricted unspecified geocoder", (done) => {
    const useGeocoder = (geocoderName: GeocoderName) =>
      UniversalGeocoder.createGeocoder({
        provider: geocoderName,
        useSsl: true,
        userAgent: "Universal Geocoder Example",
      });
    const geocoder = useGeocoder("nominatim");
    expect(geocoder).toBeDefined();
    geocoder.geocode("1600 Pennsylvania Ave, Washington, DC", (results) => {
      expect(results).toBeDefined();
      done();
    });
  });
});
