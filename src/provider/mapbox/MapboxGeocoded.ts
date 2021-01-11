import Geocoded, { GeocodedObject } from "Geocoded";

export interface MapboxGeocodedObject extends GeocodedObject {
  readonly types?: string[];
}

export default class MapboxGeocoded extends Geocoded {
  private readonly types?: string[];

  protected constructor({ types, ...geocodedObject }: MapboxGeocodedObject) {
    super(geocodedObject);
    this.types = types;
  }

  public static create(object: MapboxGeocodedObject): MapboxGeocoded {
    return new this(object);
  }

  public toObject(): MapboxGeocodedObject {
    return {
      ...super.toObject(),
      types: this.types,
    };
  }

  public withTypes(types: string[]): MapboxGeocoded {
    return new MapboxGeocoded({
      ...this.toObject(),
      types,
    });
  }

  public getTypes(): undefined | string[] {
    return this.types;
  }
}
