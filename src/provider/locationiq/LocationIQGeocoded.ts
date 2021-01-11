import Geocoded, { GeocodedObject } from "Geocoded";
import AdminLevel from "AdminLevel";
import {
  LocationIQOsmType,
  LocationIQPrecision,
  LocationIQPrecisionCode,
  LocationIQPrecisionType,
} from "provider";

export interface LocationIQGeocodedObject extends GeocodedObject {
  readonly placeId?: string;
  readonly displayName?: string;
  readonly osmId?: string;
  readonly osmType?: LocationIQOsmType;
  readonly categories?: string[];
  readonly types?: string[];
  readonly distance?: number;
  readonly precision?: LocationIQPrecision;
  readonly precisionCode?: LocationIQPrecisionCode;
  readonly precisionType?: LocationIQPrecisionType;
  readonly attribution?: string;
  readonly subLocalityLevels?: AdminLevel[];
}

export default class LocationIQGeocoded extends Geocoded {
  private readonly placeId?: string;

  private readonly displayName?: string;

  private readonly osmId?: string;

  private readonly osmType?: LocationIQOsmType;

  private readonly categories?: string[];

  private readonly types?: string[];

  private readonly distance?: number;

  private readonly precision?: LocationIQPrecision;

  private readonly precisionCode?: LocationIQPrecisionCode;

  private readonly precisionType?: LocationIQPrecisionType;

  private readonly attribution?: string;

  private readonly subLocalityLevels: AdminLevel[];

  protected constructor({
    placeId,
    displayName,
    osmId,
    osmType,
    categories,
    types,
    distance,
    precision,
    precisionCode,
    precisionType,
    attribution,
    subLocalityLevels,
    ...geocodedObject
  }: LocationIQGeocodedObject) {
    super(geocodedObject);
    this.placeId = placeId;
    this.displayName = displayName;
    this.osmId = osmId;
    this.osmType = osmType;
    this.categories = categories;
    this.types = types;
    this.distance = distance;
    this.precision = precision;
    this.precisionCode = precisionCode;
    this.precisionType = precisionType;
    this.attribution = attribution;
    this.subLocalityLevels = subLocalityLevels || [];
  }

  public static create(object: LocationIQGeocodedObject): LocationIQGeocoded {
    return new this(object);
  }

  public toObject(): LocationIQGeocodedObject {
    return {
      ...super.toObject(),
      placeId: this.placeId,
      displayName: this.displayName,
      osmId: this.osmId,
      osmType: this.osmType,
      categories: this.categories,
      types: this.types,
      distance: this.distance,
      precision: this.precision,
      precisionCode: this.precisionCode,
      precisionType: this.precisionType,
      attribution: this.attribution,
      subLocalityLevels: this.subLocalityLevels,
    };
  }

  public withPlaceId(placeId: string): LocationIQGeocoded {
    return new LocationIQGeocoded({
      ...this.toObject(),
      placeId,
    });
  }

  public getPlaceId(): undefined | string {
    return this.placeId;
  }

  public withDisplayName(displayName: string): LocationIQGeocoded {
    return new LocationIQGeocoded({
      ...this.toObject(),
      displayName,
    });
  }

  public getDisplayName(): undefined | string {
    return this.displayName;
  }

  public withOsmId(osmId: string): LocationIQGeocoded {
    return new LocationIQGeocoded({
      ...this.toObject(),
      osmId,
    });
  }

  public getOsmId(): undefined | string {
    return this.osmId;
  }

  public withOsmType(osmType: LocationIQOsmType): LocationIQGeocoded {
    return new LocationIQGeocoded({
      ...this.toObject(),
      osmType,
    });
  }

  public getOsmType(): undefined | LocationIQOsmType {
    return this.osmType;
  }

  public withCategories(categories: string[]): LocationIQGeocoded {
    return new LocationIQGeocoded({
      ...this.toObject(),
      categories,
    });
  }

  public getCategories(): undefined | string[] {
    return this.categories;
  }

  public withTypes(types: string[]): LocationIQGeocoded {
    return new LocationIQGeocoded({
      ...this.toObject(),
      types,
    });
  }

  public getTypes(): undefined | string[] {
    return this.types;
  }

  public withDistance(distance: number): LocationIQGeocoded {
    return new LocationIQGeocoded({
      ...this.toObject(),
      distance,
    });
  }

  public getDistance(): undefined | number {
    return this.distance;
  }

  public withPrecision(precision: LocationIQPrecision): LocationIQGeocoded {
    return new LocationIQGeocoded({
      ...this.toObject(),
      precision,
    });
  }

  public getPrecision(): undefined | LocationIQPrecision {
    return this.precision;
  }

  public withPrecisionCode(
    precisionCode: LocationIQPrecisionCode
  ): LocationIQGeocoded {
    return new LocationIQGeocoded({
      ...this.toObject(),
      precisionCode,
    });
  }

  public getPrecisionCode(): undefined | LocationIQPrecisionCode {
    return this.precisionCode;
  }

  public withPrecisionType(
    precisionType: LocationIQPrecisionType
  ): LocationIQGeocoded {
    return new LocationIQGeocoded({
      ...this.toObject(),
      precisionType,
    });
  }

  public getPrecisionType(): undefined | LocationIQPrecisionType {
    return this.precisionType;
  }

  public withAttribution(attribution: string): LocationIQGeocoded {
    return new LocationIQGeocoded({
      ...this.toObject(),
      attribution,
    });
  }

  public getAttribution(): undefined | string {
    return this.attribution;
  }

  public addSubLocalityLevel(subLocalityLevel: AdminLevel): void {
    this.subLocalityLevels.push(subLocalityLevel);
  }

  public getSubLocalityLevels(): AdminLevel[] {
    return this.subLocalityLevels;
  }
}
