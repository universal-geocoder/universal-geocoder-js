import Geocoded, { GeocodedObject } from "Geocoded";
import { YandexKind, YandexPrecision } from "provider";

export interface YandexGeocodedObject extends GeocodedObject {
  readonly types?: YandexKind[];
  readonly precision?: YandexPrecision;
}

export default class YandexGeocoded extends Geocoded {
  private readonly types?: YandexKind[];

  private readonly precision?: YandexPrecision;

  protected constructor({
    types,
    precision,
    ...geocodedObject
  }: YandexGeocodedObject) {
    super(geocodedObject);
    this.types = types;
    this.precision = precision;
  }

  public static create(object: YandexGeocodedObject): YandexGeocoded {
    return new this(object);
  }

  public toObject(): YandexGeocodedObject {
    return {
      ...super.toObject(),
      types: this.types,
      precision: this.precision,
    };
  }

  public withTypes(types: YandexKind[]): YandexGeocoded {
    return new YandexGeocoded({
      ...this.toObject(),
      types,
    });
  }

  public getTypes(): undefined | YandexKind[] {
    return this.types;
  }

  public withPrecision(precision: YandexPrecision): YandexGeocoded {
    return new YandexGeocoded({
      ...this.toObject(),
      precision,
    });
  }

  public getPrecision(): undefined | YandexPrecision {
    return this.precision;
  }
}
