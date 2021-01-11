import { ReverseQuery, ReverseQueryObject } from "query";

export interface LocationIQReverseQueryObject extends ReverseQueryObject {
  readonly zoom?: number;
}

export default class LocationIQReverseQuery extends ReverseQuery {
  private readonly zoom?: number;

  protected constructor({
    zoom,
    ...reverseQueryObject
  }: LocationIQReverseQueryObject) {
    super(reverseQueryObject);
    this.zoom = zoom;
  }

  public static create(
    object: LocationIQReverseQueryObject
  ): LocationIQReverseQuery {
    return new this(object);
  }

  public toObject(): LocationIQReverseQueryObject {
    return {
      ...super.toObject(),
      zoom: this.zoom,
    };
  }

  public withZoom(zoom: number): LocationIQReverseQuery {
    return new LocationIQReverseQuery({ ...this.toObject(), zoom });
  }

  public getZoom(): undefined | number {
    return this.zoom;
  }
}
