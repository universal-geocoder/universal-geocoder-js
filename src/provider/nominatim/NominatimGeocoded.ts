// eslint-disable-next-line import/no-unresolved
import type * as GeoJson from "geojson";
import Geocoded, { GeocodedObject } from "Geocoded";
import AdminLevel from "AdminLevel";
import { NominatimOsmType } from "provider";

export interface NominatimGeocodedObject extends GeocodedObject {
  readonly displayName?: string;
  readonly osmId?: number;
  readonly osmType?: NominatimOsmType;
  readonly categories?: string[];
  readonly types?: string[];
  readonly attribution?: string;
  readonly subLocalityLevels?: AdminLevel[];
  readonly shape?: GeoJson.Geometry | string;
}

export default class NominatimGeocoded extends Geocoded {
  private readonly displayName?: string;

  private readonly osmId?: number;

  private readonly osmType?: NominatimOsmType;

  private readonly categories?: string[];

  private readonly types?: string[];

  private readonly attribution?: string;

  private readonly subLocalityLevels: AdminLevel[];

  private readonly shape?: GeoJson.Geometry | string;

  protected constructor({
    displayName,
    osmId,
    osmType,
    categories,
    types,
    attribution,
    subLocalityLevels,
    shape,
    ...geocodedObject
  }: NominatimGeocodedObject) {
    super(geocodedObject);
    this.displayName = displayName;
    this.osmId = osmId;
    this.osmType = osmType;
    this.categories = categories;
    this.types = types;
    this.attribution = attribution;
    this.subLocalityLevels = subLocalityLevels || [];
    this.shape = shape;
  }

  public static create(object: NominatimGeocodedObject): NominatimGeocoded {
    return new this(object);
  }

  public toObject(): NominatimGeocodedObject {
    return {
      ...super.toObject(),
      displayName: this.displayName,
      osmId: this.osmId,
      osmType: this.osmType,
      categories: this.categories,
      types: this.types,
      attribution: this.attribution,
      subLocalityLevels: this.subLocalityLevels,
      shape: this.shape,
    };
  }

  public withDisplayName(displayName: string): NominatimGeocoded {
    return new NominatimGeocoded({
      ...this.toObject(),
      displayName,
    });
  }

  public getDisplayName(): undefined | string {
    return this.displayName;
  }

  public withOsmId(osmId: number): NominatimGeocoded {
    return new NominatimGeocoded({
      ...this.toObject(),
      osmId,
    });
  }

  public getOsmId(): undefined | number {
    return this.osmId;
  }

  public withOsmType(osmType: NominatimOsmType): NominatimGeocoded {
    return new NominatimGeocoded({
      ...this.toObject(),
      osmType,
    });
  }

  public getOsmType(): undefined | NominatimOsmType {
    return this.osmType;
  }

  public withCategories(categories: string[]): NominatimGeocoded {
    return new NominatimGeocoded({
      ...this.toObject(),
      categories,
    });
  }

  public getCategories(): undefined | string[] {
    return this.categories;
  }

  public withTypes(types: string[]): NominatimGeocoded {
    return new NominatimGeocoded({
      ...this.toObject(),
      types,
    });
  }

  public getTypes(): undefined | string[] {
    return this.types;
  }

  public withAttribution(attribution: string): NominatimGeocoded {
    return new NominatimGeocoded({
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

  public withShape(shape: GeoJson.Geometry | string): NominatimGeocoded {
    return new NominatimGeocoded({
      ...this.toObject(),
      shape,
    });
  }

  public getShape(): undefined | GeoJson.Geometry | string {
    return this.shape;
  }
}
