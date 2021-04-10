import { ReverseQuery, ReverseQueryObject } from "query";

type Shape = "geojson" | "kml" | "svg" | "text";

export interface NominatimReverseQueryObject extends ReverseQueryObject {
  readonly zoom?: number;
  readonly shape?: Shape;
  readonly shapeThreshold?: number;
}

export default class NominatimReverseQuery extends ReverseQuery {
  private readonly zoom?: number;

  private readonly shape?: Shape;

  private readonly shapeThreshold?: number;

  protected constructor({
    zoom,
    shape,
    shapeThreshold,
    ...reverseQueryObject
  }: NominatimReverseQueryObject) {
    super(reverseQueryObject);
    this.zoom = zoom;
    if (shape && !["geojson", "kml", "svg", "text"].includes(shape)) {
      throw new Error(
        'The "shape" parameter can only have the following values: "geojson", "kml", "svg", "text".'
      );
    }
    this.shape = shape;
    this.shapeThreshold = shapeThreshold;
  }

  public static create(
    object: NominatimReverseQueryObject
  ): NominatimReverseQuery {
    return new this(object);
  }

  public toObject(): NominatimReverseQueryObject {
    return {
      ...super.toObject(),
      zoom: this.zoom,
      shape: this.shape,
      shapeThreshold: this.shapeThreshold,
    };
  }

  public withZoom(zoom: number): NominatimReverseQuery {
    return new NominatimReverseQuery({ ...this.toObject(), zoom });
  }

  public getZoom(): undefined | number {
    return this.zoom;
  }

  public withShape(shape: Shape): NominatimReverseQuery {
    return new NominatimReverseQuery({ ...this.toObject(), shape });
  }

  public getShape(): undefined | Shape {
    return this.shape;
  }

  public withShapeThreshold(shapeThreshold: number): NominatimReverseQuery {
    return new NominatimReverseQuery({ ...this.toObject(), shapeThreshold });
  }

  public getShapeThreshold(): undefined | number {
    return this.shapeThreshold;
  }
}
