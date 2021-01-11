import {
  ExternalLoaderBody,
  ExternalLoaderHeaders,
  ExternalLoaderInterface,
  ExternalLoaderParams,
} from "ExternalLoader";
import {
  ErrorCallback,
  GeocodedResultsCallback,
  LocationIQGeocoded,
  LocationIQGeocodeQuery,
  LocationIQGeocodeQueryObject,
  LocationIQReverseQuery,
  LocationIQReverseQueryObject,
  ProviderHelpers,
  ProviderInterface,
  ProviderOptionsInterface,
  defaultProviderOptions,
} from "provider";
import AdminLevel from "AdminLevel";
import { ResponseError } from "error";

interface LocationIQRequestParams {
  [param: string]: string | undefined;
  readonly key: string;
  readonly q?: string;
  readonly lat?: string;
  readonly lon?: string;
  readonly street?: string;
  readonly city?: string;
  readonly county?: string;
  readonly state?: string;
  readonly country?: string;
  readonly postalcode?: string;
  readonly zoom?: string;
  readonly format?: string;
  readonly viewbox?: string;
  readonly bounded?: string;
  readonly addressdetails?: string;
  readonly limit?: string;
  // eslint-disable-next-line camelcase
  readonly "accept-language"?: string;
  readonly countrycodes?: string;
  readonly namedetails?: string;
  readonly dedupe?: string;
  // eslint-disable-next-line camelcase
  readonly osm_type?: string;
  // eslint-disable-next-line camelcase
  readonly osm_id?: string;
  // eslint-disable-next-line camelcase
  readonly polygon_geojson?: string;
  // eslint-disable-next-line camelcase
  readonly polygon_kml?: string;
  // eslint-disable-next-line camelcase
  readonly polygon_svg?: string;
  // eslint-disable-next-line camelcase
  readonly polygon_text?: string;
  readonly extratags?: string;
  // eslint-disable-next-line camelcase
  readonly exclude_place_ids?: string;
  readonly normalizeaddress?: string;
  readonly normalizecity?: string;
  readonly statecode?: string;
  readonly showdistance?: string;
  readonly matchquality?: string;
  readonly postaladdress?: string;
  readonly source?: string;
  readonly jsonpCallback?: string;
}

interface LocationIQErrorResponse {
  error: string;
}

export type LocationIQOsmType = "node" | "way" | "relation";
export type LocationIQPrecision =
  | "venue"
  | "building"
  | "street"
  | "neighbourhood"
  | "island"
  | "borough"
  | "city"
  | "county"
  | "state"
  | "country"
  | "marine"
  | "postalcode";
export type LocationIQPrecisionCode = "exact" | "fallback" | "approximate";
export type LocationIQPrecisionType = "point" | "centroid" | "interpolated";

export interface LocationIQResult {
  // eslint-disable-next-line camelcase
  place_id: string;
  licence: string;
  // eslint-disable-next-line camelcase
  osm_type: LocationIQOsmType;
  // eslint-disable-next-line camelcase
  osm_id: string;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  // eslint-disable-next-line camelcase
  display_name: string;
  class?: string;
  type?: string;
  importance: number;
  icon: string;
  address: {
    // eslint-disable-next-line camelcase
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    hamlet?: string;
    suburb?: string;
    village?: string;
    town?: string;
    // eslint-disable-next-line camelcase
    city_district?: string;
    city?: string;
    region?: string;
    county?: string;
    // eslint-disable-next-line camelcase
    state_district?: string;
    state?: string;
    // eslint-disable-next-line camelcase
    state_code?: string;
    postcode?: string;
    country?: string;
    // eslint-disable-next-line camelcase
    country_code?: string;
    name?: string;
  };
  extratags?: {
    phone?: string;
    website?: string;
    wikidata?: string;
    wikipedia?: string;
    wheelchair?: string;
    // eslint-disable-next-line camelcase
    opening_hours?: string;
  };
  namedetails?: {
    name: string;
    [name: string]: string;
  };
  geojson?: {
    type: "Point";
    coordinates: [number, number];
  };
  geokml?: string;
  svg?: string;
  geotext?: string;
  statecode?: string;
  distance?: number;
  matchquality?: {
    matchcode: LocationIQPrecisionCode;
    matchtype: LocationIQPrecisionType;
    matchlevel: LocationIQPrecision;
  };
  // eslint-disable-next-line camelcase
  postal_address?: string;
}

export type LocationIQResponse =
  | LocationIQErrorResponse
  | LocationIQResult
  | LocationIQResult[];

export interface LocationIQProviderOptionsInterface
  extends ProviderOptionsInterface {
  readonly apiKey: string;
  readonly countryCodes?: string[];
  readonly source?: "nominatim" | "locationiq";
}

export const defaultLocationIQProviderOptions: LocationIQProviderOptionsInterface = {
  ...defaultProviderOptions,
  apiKey: "",
  source: "locationiq",
};

type LocationIQGeocodedResultsCallback = GeocodedResultsCallback<LocationIQGeocoded>;

export default class LocationIQProvider
  implements ProviderInterface<LocationIQGeocoded> {
  private externalLoader: ExternalLoaderInterface;

  private options: LocationIQProviderOptionsInterface;

  public constructor(
    _externalLoader: ExternalLoaderInterface,
    options: LocationIQProviderOptionsInterface = defaultLocationIQProviderOptions
  ) {
    this.externalLoader = _externalLoader;
    this.options = { ...defaultLocationIQProviderOptions, ...options };
    if (!this.options.apiKey) {
      throw new Error(
        'An API key is required for the LocationIQ provider. Please add it in the "apiKey" option.'
      );
    }
    if (!["locationiq", "nominatim"].includes(this.options.source || "")) {
      throw new Error(
        'The "source" option must either be "locationiq" or "nominatim".'
      );
    }
  }

  public geocode(
    query: string | LocationIQGeocodeQuery | LocationIQGeocodeQueryObject,
    callback?: LocationIQGeocodedResultsCallback,
    errorCallback?: ErrorCallback
  ): void | Promise<LocationIQGeocoded[]> {
    const geocodeQuery = ProviderHelpers.getGeocodeQueryFromParameter(
      query,
      LocationIQGeocodeQuery
    );

    if (geocodeQuery.getIp()) {
      throw new Error(
        "The LocationIQ provider does not support IP geolocation, only location geocoding."
      );
    }

    this.externalLoader.setOptions({
      protocol: this.options.useSsl ? "https" : "http",
      host: "locationiq.com",
      pathname: "v1/search.php",
    });

    const params: LocationIQRequestParams = this.withCommonParams(
      {
        q: geocodeQuery.getText(),
        limit: geocodeQuery.getLimit().toString(),
        countrycodes: (<LocationIQGeocodeQuery>geocodeQuery).getCountryCodes()
          ? (<LocationIQGeocodeQuery>geocodeQuery).getCountryCodes()?.join(",")
          : this.options.countryCodes?.join(","),
        exclude_place_ids: (<LocationIQGeocodeQuery>(
          geocodeQuery
        )).getExcludePlaceIds()
          ? (<LocationIQGeocodeQuery>geocodeQuery)
              .getExcludePlaceIds()
              ?.join(",")
          : undefined,
        viewbox: geocodeQuery.getBounds()
          ? `${geocodeQuery.getBounds()?.longitudeSW},${
              geocodeQuery.getBounds()?.latitudeSW
            },${geocodeQuery.getBounds()?.longitudeNE},${
              geocodeQuery.getBounds()?.latitudeNE
            }`
          : undefined,
        bounded: (<LocationIQGeocodeQuery>geocodeQuery).getBounded()
          ? (<LocationIQGeocodeQuery>geocodeQuery).getBounded()?.toString()
          : undefined,
        dedupe: (<LocationIQGeocodeQuery>geocodeQuery).getDedupe()
          ? (<LocationIQGeocodeQuery>geocodeQuery).getDedupe()?.toString()
          : undefined,
        matchquality: "1",
      },
      <LocationIQGeocodeQuery>geocodeQuery
    );

    if (!callback) {
      return new Promise((resolve, reject) =>
        this.executeRequest(
          params,
          (results) => resolve(results),
          {},
          {},
          (error) => reject(error)
        )
      );
    }
    return this.executeRequest(params, callback, {}, {}, errorCallback);
  }

  public geodecode(
    latitudeOrQuery:
      | number
      | string
      | LocationIQReverseQuery
      | LocationIQReverseQueryObject,
    longitudeOrCallback?: number | string | LocationIQGeocodedResultsCallback,
    callbackOrErrorCallback?: LocationIQGeocodedResultsCallback | ErrorCallback,
    errorCallback?: ErrorCallback
  ): void | Promise<LocationIQGeocoded[]> {
    const reverseQuery = ProviderHelpers.getReverseQueryFromParameters(
      latitudeOrQuery,
      longitudeOrCallback,
      LocationIQReverseQuery
    );
    const reverseCallback = ProviderHelpers.getCallbackFromParameters(
      longitudeOrCallback,
      callbackOrErrorCallback
    );
    const reverseErrorCallback = ProviderHelpers.getErrorCallbackFromParameters(
      longitudeOrCallback,
      callbackOrErrorCallback,
      errorCallback
    );

    this.externalLoader.setOptions({
      protocol: this.options.useSsl ? "https" : "http",
      host: "locationiq.com",
      pathname: "v1/reverse.php",
    });

    const params: LocationIQRequestParams = this.withCommonParams(
      {
        lat: reverseQuery.getCoordinates().latitude.toString(),
        lon: reverseQuery.getCoordinates().longitude.toString(),
        zoom:
          (<LocationIQReverseQuery>reverseQuery).getZoom()?.toString() || "18",
        showdistance: "1",
      },
      <LocationIQReverseQuery>reverseQuery
    );

    if (!reverseCallback) {
      return new Promise((resolve, reject) =>
        this.executeRequest(
          params,
          (results) => resolve(results),
          {},
          {},
          (error) => reject(error)
        )
      );
    }
    return this.executeRequest(
      params,
      reverseCallback,
      {},
      {},
      reverseErrorCallback
    );
  }

  private withCommonParams(
    params: Pick<
      LocationIQRequestParams,
      | "q"
      | "lat"
      | "lon"
      | "street"
      | "city"
      | "county"
      | "state"
      | "country"
      | "postalcode"
      | "zoom"
      | "viewbox"
      | "bounded"
      | "limit"
      | "countrycodes"
      | "dedupe"
      | "osm_type"
      | "osm_id"
      | "exclude_place_ids"
      | "showdistance"
      | "matchquality"
    >,
    query: LocationIQGeocodeQuery | LocationIQReverseQuery
  ): LocationIQRequestParams {
    return {
      ...params,
      key: this.options.apiKey || "",
      format: "json",
      addressdetails: "1",
      "accept-language": query.getLocale(),
      jsonpCallback: this.options.useJsonp ? "json_callback" : undefined,
      normalizeaddress: "1",
      normalizecity: "1",
      statecode: "1",
      postaladdress: "1",
      source: this.options.source === "nominatim" ? "nom" : undefined,
    };
  }

  public executeRequest(
    params: ExternalLoaderParams,
    callback: LocationIQGeocodedResultsCallback,
    headers?: ExternalLoaderHeaders,
    body?: ExternalLoaderBody,
    errorCallback?: ErrorCallback
  ): void {
    this.externalLoader.executeRequest(
      params,
      (data: LocationIQResponse) => {
        let results = data;
        if (!Array.isArray(data)) {
          if ((<LocationIQErrorResponse>data).error) {
            const errorMessage = `An error has occurred: ${
              (<LocationIQErrorResponse>data).error
            }`;
            if (errorCallback) {
              errorCallback(new ResponseError(errorMessage, data));
              return;
            }
            setTimeout(() => {
              throw new Error(errorMessage);
            });
            return;
          }
          results = [<LocationIQResult>data];
        }
        callback(
          (<LocationIQResult[]>results).map((result) =>
            LocationIQProvider.mapToGeocoded(result)
          )
        );
      },
      headers,
      body,
      errorCallback
    );
  }

  public static mapToGeocoded(result: LocationIQResult): LocationIQGeocoded {
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);
    const formattedAddress = result.postal_address;
    const displayName = result.display_name;
    const streetNumber = result.address.house_number;
    const streetName = result.address.road;
    const subLocality = result.address.suburb;
    const locality = result.address.city;
    const postalCode = result.address.postcode
      ? result.address.postcode.split(";")[0]
      : undefined;
    const region = result.address.state;
    const { country } = result.address;
    const countryCode = result.address.country_code;
    const placeId = result.place_id;
    const osmId = result.osm_id;
    const osmType = result.osm_type;
    const categories = result.class ? [result.class] : [];
    const { distance } = result;
    const types = result.type ? [result.type] : [];
    const precision = result.matchquality?.matchlevel;
    const precisionCode = result.matchquality?.matchcode;
    const precisionType = result.matchquality?.matchtype;
    const attribution = result.licence;

    let geocoded = LocationIQGeocoded.create({
      coordinates: {
        latitude,
        longitude,
      },
      formattedAddress,
      displayName,
      streetNumber,
      streetName,
      subLocality,
      locality,
      postalCode,
      region,
      country,
      countryCode,
      placeId,
      osmId,
      osmType,
      categories,
      types,
      distance,
      precision,
      precisionCode,
      precisionType,
      attribution,
    });

    geocoded = <LocationIQGeocoded>geocoded.withBounds({
      latitudeSW: parseFloat(result.boundingbox[0]),
      longitudeSW: parseFloat(result.boundingbox[2]),
      latitudeNE: parseFloat(result.boundingbox[1]),
      longitudeNE: parseFloat(result.boundingbox[3]),
    });

    const adminLevels: ("state" | "county")[] = ["state", "county"];
    adminLevels.forEach((adminLevel, level) => {
      if (result.address[adminLevel]) {
        geocoded.addAdminLevel(
          AdminLevel.create({
            level: level + 1,
            name: result.address[adminLevel] || "",
            code:
              adminLevel === "state" ? result.address.state_code : undefined,
          })
        );
      }
    });

    const subLocalityLevels: (
      | "suburb"
      | "neighbourhood"
      | "road"
      | "name"
    )[] = ["suburb", "neighbourhood", "road", "name"];
    subLocalityLevels.forEach((subLocalityLevel, level) => {
      if (result.address[subLocalityLevel]) {
        geocoded.addSubLocalityLevel(
          AdminLevel.create({
            level: level + 1,
            name: result.address[subLocalityLevel] || "",
          })
        );
      }
    });

    return geocoded;
  }
}
