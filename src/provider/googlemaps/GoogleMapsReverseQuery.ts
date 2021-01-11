import { ReverseQuery, ReverseQueryObject } from "query";
import { GoogleMapsPrecision } from "provider";

export interface GoogleMapsReverseQueryObject extends ReverseQueryObject {
  readonly types?: string[];
  readonly precisions?: GoogleMapsPrecision[];
  readonly channel?: string;
}

export default class GoogleMapsReverseQuery extends ReverseQuery {
  private readonly types?: string[];

  private readonly precisions?: GoogleMapsPrecision[];

  private readonly channel?: string;

  protected constructor({
    types,
    precisions,
    channel,
    ...reverseQueryObject
  }: GoogleMapsReverseQueryObject) {
    super(reverseQueryObject);
    this.types = types;
    this.precisions = precisions;
    this.channel = channel;
  }

  public static create(
    object: GoogleMapsReverseQueryObject
  ): GoogleMapsReverseQuery {
    return new this(object);
  }

  public toObject(): GoogleMapsReverseQueryObject {
    return {
      ...super.toObject(),
      types: this.types,
      precisions: this.precisions,
      channel: this.channel,
    };
  }

  public withTypes(types: string[]): GoogleMapsReverseQuery {
    return new GoogleMapsReverseQuery({ ...this.toObject(), types });
  }

  public getTypes(): undefined | string[] {
    return this.types;
  }

  public withPrecisions(
    precisions: GoogleMapsPrecision[]
  ): GoogleMapsReverseQuery {
    return new GoogleMapsReverseQuery({ ...this.toObject(), precisions });
  }

  public getPrecisions(): undefined | GoogleMapsPrecision[] {
    return this.precisions;
  }

  public withChannel(channel: string): GoogleMapsReverseQuery {
    return new GoogleMapsReverseQuery({ ...this.toObject(), channel });
  }

  public getChannel(): undefined | string {
    return this.channel;
  }
}
