import ProviderFactory from "GeocoderProviderFactory";

describe("Geocoder Factory", () => {
  it("expects createProvider method to return undefined for an unregistered provider", () => {
    const provider = ProviderFactory.createProvider("nonexistentProvider");
    expect(provider).toBeUndefined();
  });

  it("expects createProvider method to return a GeoPlugin Provider", () => {
    const provider = ProviderFactory.createProvider("geoplugin");
    expect(provider).toBeDefined();
  });

  it("expects createProvider method to return an OpenStreetMap Provider", () => {
    const provider = ProviderFactory.createProvider({
      provider: "openstreetmap",
      userAgent: "Test User-Agent",
    });
    expect(provider).toBeDefined();
  });
});
