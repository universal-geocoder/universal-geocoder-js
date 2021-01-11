import { GeocodeQuery, GeocodeQueryObject } from "query";
import { Coordinates } from "types";

export interface MapboxGeocodeQueryObject extends GeocodeQueryObject {
  readonly countryCodes?: string[];
  readonly proximity?: Coordinates;
  readonly types?: string[];
  readonly fuzzyMatch?: boolean;
}

export default class MapboxGeocodeQuery extends GeocodeQuery {
  private readonly countryCodes?: string[];

  private readonly proximity?: Coordinates;

  private readonly types?: string[];

  private readonly fuzzyMatch?: boolean;

  protected constructor({
    countryCodes,
    proximity,
    types,
    fuzzyMatch,
    ...geocodeQueryObject
  }: MapboxGeocodeQueryObject) {
    super(geocodeQueryObject);
    this.countryCodes = countryCodes;
    if (proximity && (!proximity.latitude || !proximity.longitude)) {
      throw new Error(
        'The "proximity" parameter must be an object with the keys: "latitude", "longitude".'
      );
    }
    this.proximity = proximity;
    this.types = types;
    this.fuzzyMatch = fuzzyMatch;
  }

  public static create(object: MapboxGeocodeQueryObject): MapboxGeocodeQuery {
    return new this(object);
  }

  public toObject(): MapboxGeocodeQueryObject {
    return {
      ...super.toObject(),
      countryCodes: this.countryCodes,
      proximity: this.proximity,
      types: this.types,
      fuzzyMatch: this.fuzzyMatch,
    };
  }

  public withCountryCodes(countryCodes: string[]): MapboxGeocodeQuery {
    return new MapboxGeocodeQuery({ ...this.toObject(), countryCodes });
  }

  public getCountryCodes(): undefined | string[] {
    return this.countryCodes;
  }

  public withProximity(proximity: Coordinates): MapboxGeocodeQuery {
    return new MapboxGeocodeQuery({ ...this.toObject(), proximity });
  }

  public getProximity(): undefined | Coordinates {
    return this.proximity;
  }

  public withTypes(types: string[]): MapboxGeocodeQuery {
    return new MapboxGeocodeQuery({ ...this.toObject(), types });
  }

  public getTypes(): undefined | string[] {
    return this.types;
  }

  public withFuzzyMatch(fuzzyMatch: boolean): MapboxGeocodeQuery {
    return new MapboxGeocodeQuery({ ...this.toObject(), fuzzyMatch });
  }

  public getFuzzyMatch(): undefined | boolean {
    return this.fuzzyMatch;
  }
}
