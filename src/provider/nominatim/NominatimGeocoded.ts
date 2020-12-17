import Geocoded, { GeocodedObject } from "Geocoded";
import AdminLevel from "AdminLevel";

export interface NominatimGeocodedObject extends GeocodedObject {
  readonly displayName?: string;
  readonly osmId?: number;
  readonly osmType?: string;
  readonly category?: string;
  readonly type?: string;
  readonly attribution?: string;
  readonly subLocalityLevels?: AdminLevel[];
}

export default class NominatimGeocoded extends Geocoded {
  private readonly displayName?: string;

  private readonly osmId?: number;

  private readonly osmType?: string;

  private readonly category?: string;

  private readonly type?: string;

  private readonly attribution?: string;

  private readonly subLocalityLevels: AdminLevel[];

  protected constructor({
    displayName,
    osmId,
    osmType,
    category,
    type,
    attribution,
    subLocalityLevels,
    ...geocodedObject
  }: NominatimGeocodedObject) {
    super(geocodedObject);
    this.displayName = displayName;
    this.osmId = osmId;
    this.osmType = osmType;
    this.category = category;
    this.type = type;
    this.attribution = attribution;
    this.subLocalityLevels = subLocalityLevels || [];
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
      category: this.category,
      type: this.type,
      attribution: this.attribution,
      subLocalityLevels: this.subLocalityLevels,
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

  public withOsmType(osmType: string): NominatimGeocoded {
    return new NominatimGeocoded({
      ...this.toObject(),
      osmType,
    });
  }

  public getOsmType(): undefined | string {
    return this.osmType;
  }

  public withCategory(category: string): NominatimGeocoded {
    return new NominatimGeocoded({
      ...this.toObject(),
      category,
    });
  }

  public getCategory(): undefined | string {
    return this.category;
  }

  public withType(type: string): NominatimGeocoded {
    return new NominatimGeocoded({
      ...this.toObject(),
      type,
    });
  }

  public getType(): undefined | string {
    return this.type;
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
}
