import { GeocodeQuery, GeocodeQueryObject } from "query";

type Shape = "geojson" | "kml" | "svg" | "text";

export interface NominatimGeocodeQueryObject extends GeocodeQueryObject {
  readonly countryCodes?: string[];
  readonly excludePlaceIds?: number[];
  readonly bounded?: boolean;
  readonly dedupe?: boolean;
  readonly shape?: Shape;
  readonly shapeThreshold?: number;
}

export default class NominatimGeocodeQuery extends GeocodeQuery {
  private readonly countryCodes?: string[];

  private readonly excludePlaceIds?: number[];

  private readonly bounded?: boolean;

  private readonly dedupe?: boolean;

  private readonly shape?: Shape;

  private readonly shapeThreshold?: number;

  protected constructor({
    countryCodes,
    excludePlaceIds,
    bounded,
    bounds,
    dedupe,
    shape,
    shapeThreshold,
    ...geocodeQueryObject
  }: NominatimGeocodeQueryObject) {
    super({ bounds, ...geocodeQueryObject });
    this.countryCodes = countryCodes;
    this.excludePlaceIds = excludePlaceIds;
    if (bounded && !bounds) {
      throw new Error(
        'The "bounded" parameter can only be used with the "bounds" parameter.'
      );
    }
    this.bounded = bounded;
    this.dedupe = dedupe;
    if (shape && !["geojson", "kml", "svg", "text"].includes(shape)) {
      throw new Error(
        'The "shape" parameter can only have the following values: "geojson", "kml", "svg", "text".'
      );
    }
    this.shape = shape;
    this.shapeThreshold = shapeThreshold;
  }

  public static create(
    object: NominatimGeocodeQueryObject
  ): NominatimGeocodeQuery {
    return new this(object);
  }

  public toObject(): NominatimGeocodeQueryObject {
    return {
      ...super.toObject(),
      countryCodes: this.countryCodes,
      excludePlaceIds: this.excludePlaceIds,
      bounded: this.bounded,
      dedupe: this.dedupe,
      shape: this.shape,
      shapeThreshold: this.shapeThreshold,
    };
  }

  public withCountryCodes(countryCodes: string[]): NominatimGeocodeQuery {
    return new NominatimGeocodeQuery({ ...this.toObject(), countryCodes });
  }

  public getCountryCodes(): undefined | string[] {
    return this.countryCodes;
  }

  public withExcludePlaceIds(excludePlaceIds: number[]): NominatimGeocodeQuery {
    return new NominatimGeocodeQuery({ ...this.toObject(), excludePlaceIds });
  }

  public getExcludePlaceIds(): undefined | number[] {
    return this.excludePlaceIds;
  }

  public withBounded(bounded: boolean): NominatimGeocodeQuery {
    return new NominatimGeocodeQuery({ ...this.toObject(), bounded });
  }

  public getBounded(): undefined | boolean {
    return this.bounded;
  }

  public withDedupe(dedupe: boolean): NominatimGeocodeQuery {
    return new NominatimGeocodeQuery({ ...this.toObject(), dedupe });
  }

  public getDedupe(): undefined | boolean {
    return this.dedupe;
  }

  public withShape(shape: Shape): NominatimGeocodeQuery {
    return new NominatimGeocodeQuery({ ...this.toObject(), shape });
  }

  public getShape(): undefined | Shape {
    return this.shape;
  }

  public withShapeThreshold(shapeThreshold: number): NominatimGeocodeQuery {
    return new NominatimGeocodeQuery({ ...this.toObject(), shapeThreshold });
  }

  public getShapeThreshold(): undefined | number {
    return this.shapeThreshold;
  }
}
