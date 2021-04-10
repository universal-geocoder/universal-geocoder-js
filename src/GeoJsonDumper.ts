// eslint-disable-next-line import/no-unresolved
import type { Feature } from "geojson";
import Geocoded from "Geocoded";

export default class GeoJsonDumper {
  private static baseGeoJson: Feature = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Point",
      coordinates: [0, 0],
    },
  };

  public static dump(geocoded: Geocoded): Feature {
    let result = GeoJsonDumper.baseGeoJson;
    const {
      coordinates,
      bounds,
      adminLevels,
      ...geocodedProperties
    } = geocoded.toObject();

    let properties: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [property: string]: any;
    } = { ...geocodedProperties };
    Object.keys(properties).forEach(
      (property) =>
        properties[property] === undefined && delete properties[property]
    );

    if (adminLevels && adminLevels.length > 0) {
      properties = {
        ...properties,
        adminLevels: adminLevels.map((adminLevel) => adminLevel.toObject()),
      };
    }

    result = { ...result, properties };

    if (coordinates) {
      result = {
        ...result,
        ...{
          geometry: {
            ...result.geometry,
            type: "Point",
            coordinates: [
              parseFloat(coordinates.longitude.toString()),
              parseFloat(coordinates.latitude.toString()),
            ],
          },
        },
      };
    }

    if (bounds) {
      result = {
        ...result,
        bbox: [
          parseFloat(bounds.longitudeSW.toString()),
          parseFloat(bounds.latitudeSW.toString()),
          parseFloat(bounds.longitudeNE.toString()),
          parseFloat(bounds.latitudeNE.toString()),
        ],
      };
    }

    return result;
  }
}
