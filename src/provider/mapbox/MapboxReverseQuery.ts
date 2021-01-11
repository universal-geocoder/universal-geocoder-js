import { ReverseQuery, ReverseQueryObject } from "query";

type ReverseMode = "distance" | "score";

export interface MapboxReverseQueryObject extends ReverseQueryObject {
  readonly countryCodes?: string[];
  readonly reverseMode?: ReverseMode;
  readonly types?: string[];
}

export default class MapboxReverseQuery extends ReverseQuery {
  private readonly countryCodes?: string[];

  private readonly reverseMode?: ReverseMode;

  private readonly types?: string[];

  protected constructor({
    countryCodes,
    reverseMode,
    types,
    ...reverseQueryObject
  }: MapboxReverseQueryObject) {
    super(reverseQueryObject);
    this.countryCodes = countryCodes;
    this.reverseMode = reverseMode;
    this.types = types;
  }

  public static create(object: MapboxReverseQueryObject): MapboxReverseQuery {
    return new this(object);
  }

  public toObject(): MapboxReverseQueryObject {
    return {
      ...super.toObject(),
      countryCodes: this.countryCodes,
      reverseMode: this.reverseMode,
      types: this.types,
    };
  }

  public withCountryCodes(countryCodes: string[]): MapboxReverseQuery {
    return new MapboxReverseQuery({ ...this.toObject(), countryCodes });
  }

  public getCountryCodes(): undefined | string[] {
    return this.countryCodes;
  }

  public withReverseMode(reverseMode: ReverseMode): MapboxReverseQuery {
    return new MapboxReverseQuery({ ...this.toObject(), reverseMode });
  }

  public getReverseMode(): undefined | ReverseMode {
    return this.reverseMode;
  }

  public withTypes(types: string[]): MapboxReverseQuery {
    return new MapboxReverseQuery({ ...this.toObject(), types });
  }

  public getTypes(): undefined | string[] {
    return this.types;
  }
}
