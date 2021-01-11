import { ReverseQuery, ReverseQueryObject } from "query";
import { YandexKind } from "provider";

export interface YandexReverseQueryObject extends ReverseQueryObject {
  readonly types?: YandexKind[];
  readonly skip?: number;
}

export default class YandexReverseQuery extends ReverseQuery {
  private readonly types?: YandexKind[];

  private readonly skip?: number;

  protected constructor({
    types,
    skip,
    ...reverseQueryObject
  }: YandexReverseQueryObject) {
    super(reverseQueryObject);
    if (types && types.length > 1) {
      throw new Error(
        'The "types" parameter must contain only one location type.'
      );
    }
    this.types = types;
    this.skip = skip;
  }

  public static create(object: YandexReverseQueryObject): YandexReverseQuery {
    return new this(object);
  }

  public toObject(): YandexReverseQueryObject {
    return {
      ...super.toObject(),
      types: this.types,
      skip: this.skip,
    };
  }

  public withTypes(types: YandexKind[]): YandexReverseQuery {
    return new YandexReverseQuery({ ...this.toObject(), types });
  }

  public getTypes(): undefined | YandexKind[] {
    return this.types;
  }

  public withSkip(skip: number): YandexReverseQuery {
    return new YandexReverseQuery({ ...this.toObject(), skip });
  }

  public getSkip(): undefined | number {
    return this.skip;
  }
}
