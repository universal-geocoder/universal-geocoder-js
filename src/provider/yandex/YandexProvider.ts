import {
  ExternalLoaderBody,
  ExternalLoaderHeaders,
  ExternalLoaderInterface,
  ExternalLoaderParams,
} from "ExternalLoader";
import {
  ErrorCallback,
  GeocodedResultsCallback,
  ProviderHelpers,
  ProviderInterface,
  ProviderOptionsInterface,
  YandexGeocoded,
  YandexGeocodeQuery,
  YandexGeocodeQueryObject,
  YandexReverseQuery,
  YandexReverseQueryObject,
  defaultProviderOptions,
} from "provider";
import AdminLevel from "AdminLevel";
import { flattenObject } from "utils";

export type YandexKind =
  | "house"
  | "street"
  | "metro"
  | "district"
  | "locality"
  | "area"
  | "province"
  | "country"
  | "region"
  | "hydro"
  | "railway_station"
  | "station"
  | "route"
  | "vegetation"
  | "airport"
  | "entrance"
  | "other";

export type YandexPrecision =
  | "exact"
  | "number"
  | "near"
  | "range"
  | "street"
  | "other";

interface YandexRequestParams {
  [param: string]: string | undefined;
  readonly apikey?: string;
  readonly geocode: string;
  readonly format: string;
  readonly lang?: string;
  readonly kind?: YandexKind;
  readonly rspn?: "0" | "1";
  readonly ll?: string;
  readonly spn?: string;
  readonly bbox?: string;
  readonly skip?: string;
  readonly results?: string;
  readonly jsonpCallback?: string;
}

export interface YandexResult {
  metaDataProperty: {
    GeocoderMetaData: {
      kind: YandexKind;
      text: string;
      precision: YandexPrecision;
      AddressDetails: {
        Country: {
          AddressLine: string;
          CountryNameCode: string;
          CountryName: string;
          AdministrativeArea?: {
            AdministrativeAreaName: string;
            SubAdministrativeArea?: {
              SubAdministrativeAreaName: string;
              Locality?: {
                LocalityName: string;
                Thoroughfare?: {
                  ThoroughfareName: string;
                  Premise: {
                    PremiseNumber: string;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
  description: string;
  name: string;
  boundedBy: {
    Envelope: {
      lowerCorner: string;
      upperCorner: string;
    };
  };
  Point: {
    pos: string;
  };
}

export interface YandexResponse {
  response: {
    GeoObjectCollection: {
      metaDataProperty: {
        GeocoderResponseMetaData: {
          request: string;
          suggest?: {
            fix: string;
          };
          found: string;
          results: string;
          skip: string;
        };
      };
      featureMember: {
        GeoObject: YandexResult;
      }[];
    };
  };
}

interface YandexFlattenedAddressDetails {
  CountryNameCode?: string;
  CountryName?: string;
  AdministrativeAreaName?: string;
  SubAdministrativeAreaName?: string;
  LocalityName?: string;
  DependentLocalityName?: string;
  ThoroughfareName?: string;
  PremiseNumber?: string;
}

export interface YandexProviderOptionsInterface
  extends ProviderOptionsInterface {
  readonly apiKey: string;
}

export const defaultYandexProviderOptions = {
  ...defaultProviderOptions,
  apiKey: "",
};

type YandexGeocodedResultsCallback = GeocodedResultsCallback<YandexGeocoded>;

export default class YandexProvider
  implements ProviderInterface<YandexGeocoded> {
  private externalLoader: ExternalLoaderInterface;

  private options: YandexProviderOptionsInterface;

  public constructor(
    _externalLoader: ExternalLoaderInterface,
    options: YandexProviderOptionsInterface = defaultYandexProviderOptions
  ) {
    this.externalLoader = _externalLoader;
    this.options = { ...defaultYandexProviderOptions, ...options };
    if (!this.options.apiKey) {
      throw new Error(
        'An API key is required for the Yandex provider. Please add it in the "apiKey" option.'
      );
    }
  }

  public geocode(
    query: string | YandexGeocodeQuery | YandexGeocodeQueryObject,
    callback?: YandexGeocodedResultsCallback,
    errorCallback?: ErrorCallback
  ): void | Promise<YandexGeocoded[]> {
    const geocodeQuery = ProviderHelpers.getGeocodeQueryFromParameter(
      query,
      YandexGeocodeQuery
    );

    if (geocodeQuery.getIp()) {
      throw new Error(
        "The Yandex provider does not support IP geolocation, only location geocoding."
      );
    }

    this.externalLoader.setOptions({
      protocol: this.options.useSsl ? "https" : "http",
      host: "geocode-maps.yandex.ru",
      pathname: "1.x",
    });

    let rspn: "0" | "1" | undefined;
    if ((<YandexGeocodeQuery>geocodeQuery).getBounded() === false) {
      rspn = "0";
    } else if ((<YandexGeocodeQuery>geocodeQuery).getBounded() === true) {
      rspn = "1";
    }

    const params: YandexRequestParams = this.withCommonParams(
      {
        geocode: geocodeQuery.getText() || "",
        rspn,
        ll: (<YandexGeocodeQuery>geocodeQuery).getProximity()
          ? `${(<YandexGeocodeQuery>geocodeQuery).getProximity()?.longitude},${
              (<YandexGeocodeQuery>geocodeQuery).getProximity()?.latitude
            }`
          : undefined,
        spn: (<YandexGeocodeQuery>geocodeQuery).getSpan()
          ? `${(<YandexGeocodeQuery>geocodeQuery).getSpan()?.spanLongitude},${
              (<YandexGeocodeQuery>geocodeQuery).getSpan()?.spanLatitude
            }`
          : undefined,
        bbox: geocodeQuery.getBounds()
          ? `${geocodeQuery.getBounds()?.longitudeSW},${
              geocodeQuery.getBounds()?.latitudeSW
            }~${geocodeQuery.getBounds()?.longitudeNE},${
              geocodeQuery.getBounds()?.latitudeNE
            }`
          : undefined,
      },
      <YandexGeocodeQuery>geocodeQuery
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
      | YandexReverseQuery
      | YandexReverseQueryObject,
    longitudeOrCallback?: number | string | YandexGeocodedResultsCallback,
    callbackOrErrorCallback?: YandexGeocodedResultsCallback | ErrorCallback,
    errorCallback?: ErrorCallback
  ): void | Promise<YandexGeocoded[]> {
    const reverseQuery = ProviderHelpers.getReverseQueryFromParameters(
      latitudeOrQuery,
      longitudeOrCallback,
      YandexReverseQuery
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
      host: "geocode-maps.yandex.ru",
      pathname: "1.x",
    });

    const params: YandexRequestParams = this.withCommonParams(
      {
        geocode: `${reverseQuery.getCoordinates().longitude},${
          reverseQuery.getCoordinates().latitude
        }`,
        kind: (<YandexReverseQuery>reverseQuery).getTypes()
          ? (<YandexReverseQuery>reverseQuery).getTypes()?.[0]
          : undefined,
      },
      <YandexReverseQuery>reverseQuery
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
      YandexRequestParams,
      "geocode" | "rspn" | "ll" | "spn" | "bbox" | "kind"
    >,
    query: YandexGeocodeQuery | YandexReverseQuery
  ): YandexRequestParams {
    return {
      ...params,
      apikey: this.options.apiKey,
      format: "json",
      lang: query.getLocale(),
      results: query.getLimit().toString(),
      skip: query.getSkip()?.toString(),
      jsonpCallback: this.options.useJsonp ? "callback" : undefined,
    };
  }

  public executeRequest(
    params: ExternalLoaderParams,
    callback: YandexGeocodedResultsCallback,
    headers?: ExternalLoaderHeaders,
    body?: ExternalLoaderBody,
    errorCallback?: ErrorCallback
  ): void {
    this.externalLoader.executeRequest(
      params,
      (data: YandexResponse) => {
        callback(
          data.response.GeoObjectCollection.featureMember.map((result) =>
            YandexProvider.mapToGeocoded(result.GeoObject)
          )
        );
      },
      headers,
      body,
      errorCallback
    );
  }

  public static mapToGeocoded(result: YandexResult): YandexGeocoded {
    const point = result.Point.pos.split(" ");
    const latitude = parseFloat(point[1]);
    const longitude = parseFloat(point[0]);

    const addressDetails: YandexFlattenedAddressDetails = flattenObject(
      result.metaDataProperty.GeocoderMetaData.AddressDetails
    );

    const streetNumber = addressDetails.PremiseNumber;
    const streetName = addressDetails.ThoroughfareName;
    const subLocality = addressDetails.DependentLocalityName;
    const locality = addressDetails.LocalityName;
    const region = addressDetails.AdministrativeAreaName;
    const country = addressDetails.CountryName;
    const countryCode = addressDetails.CountryNameCode;
    const types = [result.metaDataProperty.GeocoderMetaData.kind];
    const { precision } = result.metaDataProperty.GeocoderMetaData;

    let geocoded = YandexGeocoded.create({
      coordinates: {
        latitude,
        longitude,
      },
      streetNumber,
      streetName,
      subLocality,
      locality,
      region,
      country,
      countryCode,
      types,
      precision,
    });

    const adminLevels: (
      | "AdministrativeAreaName"
      | "SubAdministrativeAreaName"
    )[] = ["AdministrativeAreaName", "SubAdministrativeAreaName"];
    adminLevels.forEach((adminLevel, level) => {
      if (addressDetails[adminLevel]) {
        geocoded.addAdminLevel(
          AdminLevel.create({
            level: level + 1,
            name: addressDetails[adminLevel] || "",
          })
        );
      }
    });

    const lowerCorner = result.boundedBy.Envelope.lowerCorner.split(" ");
    const upperCorner = result.boundedBy.Envelope.upperCorner.split(" ");
    geocoded = <YandexGeocoded>geocoded.withBounds({
      latitudeSW: parseFloat(lowerCorner[1]),
      longitudeSW: parseFloat(lowerCorner[0]),
      latitudeNE: parseFloat(upperCorner[1]),
      longitudeNE: parseFloat(upperCorner[0]),
    });

    return geocoded;
  }
}
