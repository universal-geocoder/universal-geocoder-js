import {
  ExternalLoaderBody,
  ExternalLoaderHeaders,
  ExternalLoaderInterface,
  ExternalLoaderParams,
} from "ExternalLoader";
import {
  ErrorCallback,
  GeocodedResultsCallback,
  NominatimGeocoded,
  NominatimReverseQuery,
  NominatimReverseQueryObject,
  NominatimGeocodeQueryObject,
  NominatimGeocodeQuery,
  ProviderHelpers,
  ProviderInterface,
  ProviderOptionsInterface,
  defaultProviderOptions,
} from "provider";
import AdminLevel from "AdminLevel";
import { ResponseError } from "error";

interface NominatimRequestParams {
  [param: string]: string | undefined;
  readonly q?: string;
  readonly lat?: string;
  readonly lon?: string;
  readonly street?: string;
  readonly city?: string;
  readonly county?: string;
  readonly state?: string;
  readonly country?: string;
  readonly postalcode?: string;
  readonly format: string;
  readonly addressdetails: string;
  readonly namedetails?: string;
  readonly extratags?: string;
  readonly zoom?: string;
  readonly limit?: string;
  // eslint-disable-next-line camelcase
  readonly "accept-language"?: string;
  readonly countrycodes?: string;
  // eslint-disable-next-line camelcase
  readonly exclude_place_ids?: string;
  readonly viewbox?: string;
  readonly bounded?: string;
  readonly dedupe?: string;
  // eslint-disable-next-line camelcase
  readonly polygon_geojson?: string;
  // eslint-disable-next-line camelcase
  readonly polygon_kml?: string;
  // eslint-disable-next-line camelcase
  readonly polygon_svg?: string;
  // eslint-disable-next-line camelcase
  readonly polygon_text?: string;
  // eslint-disable-next-line camelcase
  readonly polygon_threshold?: string;
  readonly jsonpCallback?: string;
}

interface NominatimErrorResponse {
  error: string;
}

export type NominatimOsmType = "node" | "way" | "relation";

export interface NominatimResult {
  // eslint-disable-next-line camelcase
  place_id: number;
  licence: string;
  // eslint-disable-next-line camelcase
  osm_type: NominatimOsmType;
  // eslint-disable-next-line camelcase
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  // eslint-disable-next-line camelcase
  display_name: string;
  category: string;
  type: string;
  importance: number;
  icon: string;
  address: {
    attraction?: string;
    pedestrian?: string;
    // eslint-disable-next-line camelcase
    house_name?: string;
    // eslint-disable-next-line camelcase
    house_number?: string;
    road?: string;
    retail?: string;
    commercial?: string;
    industrial?: string;
    farmyard?: string;
    farm?: string;
    residental?: string;
    // eslint-disable-next-line camelcase
    city_block?: string;
    quarter?: string;
    allotments?: string;
    neighbourhood?: string;
    // eslint-disable-next-line camelcase
    isolated_dwelling?: string;
    croft?: string;
    hamlet?: string;
    // eslint-disable-next-line camelcase
    city_district?: string;
    district?: string;
    borough?: string;
    subdivision?: string;
    suburb?: string;
    municipality?: string;
    city?: string;
    town?: string;
    village?: string;
    region?: string;
    // eslint-disable-next-line camelcase
    state_district?: string;
    state?: string;
    county?: string;
    postcode?: string;
    country?: string;
    // eslint-disable-next-line camelcase
    country_code?: string;
    continent?: string;
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
}

export type NominatimResponse =
  | NominatimErrorResponse
  | NominatimResult
  | NominatimResult[];

export interface NominatimProviderOptionsInterface
  extends ProviderOptionsInterface {
  readonly host?: string;
  readonly userAgent: string;
  readonly referer?: string;
  readonly countryCodes?: string[];
}

export const defaultNominatimProviderOptions = {
  ...defaultProviderOptions,
  host: "nominatim.openstreetmap.org",
  userAgent: "",
};

type NominatimGeocodedResultsCallback = GeocodedResultsCallback<NominatimGeocoded>;

export default class NominatimProvider
  implements ProviderInterface<NominatimGeocoded> {
  private externalLoader: ExternalLoaderInterface;

  private options: NominatimProviderOptionsInterface;

  public constructor(
    _externalLoader: ExternalLoaderInterface,
    options: NominatimProviderOptionsInterface = defaultNominatimProviderOptions
  ) {
    this.externalLoader = _externalLoader;
    this.options = { ...defaultNominatimProviderOptions, ...options };
    if (
      this.options.host === defaultNominatimProviderOptions.host &&
      !this.options.userAgent
    ) {
      throw new Error(
        'An User-Agent identifying your application is required for the OpenStreetMap / Nominatim provider when using the default host. Please add it in the "userAgent" option.'
      );
    }
  }

  public geocode(
    query: string | NominatimGeocodeQuery | NominatimGeocodeQueryObject,
    callback?: NominatimGeocodedResultsCallback,
    errorCallback?: ErrorCallback
  ): void | Promise<NominatimGeocoded[]> {
    const geocodeQuery = ProviderHelpers.getGeocodeQueryFromParameter(
      query,
      NominatimGeocodeQuery
    );

    if (geocodeQuery.getIp()) {
      throw new Error(
        "The OpenStreetMap / Nominatim provider does not support IP geolocation, only location geocoding."
      );
    }

    this.externalLoader.setOptions({
      protocol: this.options.useSsl ? "https" : "http",
      host: this.options.host,
      pathname: "search",
    });

    const params: NominatimRequestParams = this.withCommonParams(
      {
        q: geocodeQuery.getText(),
        limit: geocodeQuery.getLimit().toString(),
        countrycodes: (<NominatimGeocodeQuery>geocodeQuery).getCountryCodes()
          ? (<NominatimGeocodeQuery>geocodeQuery).getCountryCodes()?.join(",")
          : this.options.countryCodes?.join(","),
        exclude_place_ids: (<NominatimGeocodeQuery>(
          geocodeQuery
        )).getExcludePlaceIds()
          ? (<NominatimGeocodeQuery>geocodeQuery)
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
        bounded: (<NominatimGeocodeQuery>geocodeQuery).getBounded()
          ? (<NominatimGeocodeQuery>geocodeQuery).getBounded()?.toString()
          : undefined,
        dedupe: (<NominatimGeocodeQuery>geocodeQuery).getDedupe()
          ? (<NominatimGeocodeQuery>geocodeQuery).getDedupe()?.toString()
          : undefined,
      },
      <NominatimGeocodeQuery>geocodeQuery
    );

    if (!callback) {
      return new Promise((resolve, reject) =>
        this.executeRequest(
          params,
          (results) => resolve(results),
          this.getHeaders(),
          {},
          (error) => reject(error)
        )
      );
    }
    return this.executeRequest(
      params,
      callback,
      this.getHeaders(),
      {},
      errorCallback
    );
  }

  public geodecode(
    latitudeOrQuery:
      | number
      | string
      | NominatimReverseQuery
      | NominatimReverseQueryObject,
    longitudeOrCallback?: number | string | NominatimGeocodedResultsCallback,
    callbackOrErrorCallback?: NominatimGeocodedResultsCallback | ErrorCallback,
    errorCallback?: ErrorCallback
  ): void | Promise<NominatimGeocoded[]> {
    const reverseQuery = ProviderHelpers.getReverseQueryFromParameters(
      latitudeOrQuery,
      longitudeOrCallback,
      NominatimReverseQuery
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
      host: this.options.host,
      pathname: "reverse",
    });

    const params: NominatimRequestParams = this.withCommonParams(
      {
        lat: reverseQuery.getCoordinates().latitude.toString(),
        lon: reverseQuery.getCoordinates().longitude.toString(),
        zoom:
          (<NominatimReverseQuery>reverseQuery).getZoom()?.toString() || "18",
      },
      <NominatimReverseQuery>reverseQuery
    );

    if (!reverseCallback) {
      return new Promise((resolve, reject) =>
        this.executeRequest(
          params,
          (results) => resolve(results),
          this.getHeaders(),
          {},
          (error) => reject(error)
        )
      );
    }
    return this.executeRequest(
      params,
      reverseCallback,
      this.getHeaders(),
      {},
      reverseErrorCallback
    );
  }

  private withCommonParams(
    params: Partial<NominatimRequestParams>,
    query: NominatimGeocodeQuery | NominatimReverseQuery
  ): NominatimRequestParams {
    return {
      ...params,
      format: "jsonv2",
      addressdetails: "1",
      polygon_geojson:
        query.getShape() && query.getShape() === "geojson" ? "1" : undefined,
      polygon_kml:
        query.getShape() && query.getShape() === "kml" ? "1" : undefined,
      polygon_svg:
        query.getShape() && query.getShape() === "svg" ? "1" : undefined,
      polygon_text:
        query.getShape() && query.getShape() === "text" ? "1" : undefined,
      polygon_threshold: query.getShapeThreshold()
        ? query.getShapeThreshold()?.toString()
        : undefined,
      jsonpCallback: this.options.useJsonp ? "json_callback" : undefined,
      "accept-language": query.getLocale(),
    };
  }

  private getHeaders(): ExternalLoaderHeaders {
    return {
      "User-Agent": this.options.userAgent || "",
      Referer: this.options.referer,
    };
  }

  public executeRequest(
    params: ExternalLoaderParams,
    callback: NominatimGeocodedResultsCallback,
    headers?: ExternalLoaderHeaders,
    body?: ExternalLoaderBody,
    errorCallback?: ErrorCallback
  ): void {
    this.externalLoader.executeRequest(
      params,
      (data: NominatimResponse) => {
        let results = data;
        if (!Array.isArray(data)) {
          if ((<NominatimErrorResponse>data).error) {
            const errorMessage = `An error has occurred: ${
              (<NominatimErrorResponse>data).error
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
          results = [<NominatimResult>data];
        }
        callback(
          (<NominatimResult[]>results).map((result: NominatimResult) =>
            NominatimProvider.mapToGeocoded(result)
          )
        );
      },
      headers,
      body,
      errorCallback
    );
  }

  public static mapToGeocoded(result: NominatimResult): NominatimGeocoded {
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);
    const displayName = result.display_name;
    const streetNumber = result.address.house_number;
    const streetName = result.address.road || result.address.pedestrian;
    const subLocality = result.address.suburb;
    let locality: string | undefined;
    const postalCode = result.address.postcode
      ? result.address.postcode.split(";")[0]
      : undefined;
    const region = result.address.state;
    const { country } = result.address;
    const countryCode = result.address.country_code;
    const osmId = result.osm_id;
    const osmType = result.osm_type;
    const categories = [result.category];
    const types = [result.type];
    const attribution = result.licence;
    const shape =
      result.geojson || result.geokml || result.svg || result.geotext;

    const localityTypes: ("city" | "town" | "village" | "hamlet")[] = [
      "city",
      "town",
      "village",
      "hamlet",
    ];
    localityTypes.forEach((localityType) => {
      if (result.address[localityType] && !locality) {
        locality = result.address[localityType];
      }
    });

    let geocoded = NominatimGeocoded.create({
      coordinates: {
        latitude,
        longitude,
      },
      displayName,
      streetNumber,
      streetName,
      subLocality,
      locality,
      postalCode,
      region,
      country,
      countryCode,
      osmId,
      osmType,
      categories,
      types,
      attribution,
      shape,
    });

    geocoded = <NominatimGeocoded>geocoded.withBounds({
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
          })
        );
      }
    });

    const subLocalityLevels: (
      | "city_district"
      | "district"
      | "borough"
      | "suburb"
      | "subdivision"
      | "hamlet"
      | "croft"
      | "isolated_dwelling"
      | "neighbourhood"
      | "allotments"
      | "quarter"
      | "city_block"
      | "residental"
      | "farm"
      | "farmyard"
      | "industrial"
      | "commercial"
      | "retail"
      | "road"
      | "house_name"
    )[][] = [
      ["city_district", "district", "borough", "suburb", "subdivision"],
      ["hamlet", "croft", "isolated_dwelling"],
      ["neighbourhood", "allotments", "quarter"],
      [
        "city_block",
        "residental",
        "farm",
        "farmyard",
        "industrial",
        "commercial",
        "retail",
      ],
      ["road"],
      ["house_name"],
    ];
    subLocalityLevels.forEach((subLocalities, level) => {
      subLocalities.forEach((subLocalityLevel) => {
        if (result.address[subLocalityLevel]) {
          geocoded.addSubLocalityLevel(
            AdminLevel.create({
              level: level + 1,
              name: result.address[subLocalityLevel] || "",
            })
          );
        }
      });
    });

    return geocoded;
  }
}
