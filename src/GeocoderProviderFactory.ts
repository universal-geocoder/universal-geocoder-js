import {
  BingProvider,
  BingProviderOptionsInterface,
  ChainProvider,
  ChainProviderOptionsInterface,
  GeoPluginProvider,
  GoogleMapsProvider,
  GoogleMapsProviderOptionsInterface,
  LocationIQProvider,
  LocationIQProviderOptionsInterface,
  MapboxProvider,
  MapboxProviderOptionsInterface,
  MapQuestProvider,
  MapQuestProviderOptionsInterface,
  NominatimProvider,
  NominatimProviderOptionsInterface,
  OpenCageProvider,
  OpenCageProviderOptionsInterface,
  ProviderInterface,
  YandexProvider,
  YandexProviderOptionsInterface,
  defaultBingProviderOptions,
  defaultChainProviderOptions,
  defaultLocationIQProviderOptions,
  defaultMapboxProviderOptions,
  defaultMapQuestProviderOptions,
  defaultNominatimProviderOptions,
  defaultOpenCageProviderOptions,
  defaultYandexProviderOptions,
  defaultProviderOptions,
} from "provider";
import Geocoded from "Geocoded";
import ExternalLoader from "ExternalLoader";

export type ProviderName =
  | "chain"
  | "bing"
  | "bingmaps"
  | "microsoft"
  | "geoplugin"
  | "google"
  | "googlemaps"
  | "locationiq"
  | "mapbox"
  | "mapquest"
  | "nominatim"
  | "openstreetmap"
  | "opencage"
  | "yandex";

export interface ProviderOptionInterface {
  provider: string;
}

export interface RestrictedProviderOptionInterface {
  provider: ProviderName;
}

export interface ChainGeocoderProviderFactoryOptions
  extends RestrictedProviderOptionInterface,
    ChainProviderOptionsInterface {
  provider: "chain";
}

export interface BingGeocoderProviderFactoryOptions
  extends RestrictedProviderOptionInterface,
    BingProviderOptionsInterface {
  provider: "bing" | "bingmaps" | "microsoft";
}

export interface GeoPluginGeocoderProviderFactoryOptions
  extends RestrictedProviderOptionInterface {
  provider: "geoplugin";
}

export interface GoogleMapsGeocoderProviderFactoryOptions
  extends RestrictedProviderOptionInterface,
    GoogleMapsProviderOptionsInterface {
  provider: "google" | "googlemaps";
}

export interface LocationIQGeocoderProviderFactoryOptions
  extends RestrictedProviderOptionInterface,
    LocationIQProviderOptionsInterface {
  provider: "locationiq";
}

export interface MapboxGeocoderProviderFactoryOptions
  extends RestrictedProviderOptionInterface,
    MapboxProviderOptionsInterface {
  provider: "mapbox";
}

export interface MapQuestGeocoderProviderFactoryOptions
  extends RestrictedProviderOptionInterface,
    MapQuestProviderOptionsInterface {
  provider: "mapquest";
}

export interface NominatimGeocoderProviderFactoryOptions
  extends RestrictedProviderOptionInterface,
    NominatimProviderOptionsInterface {
  provider: "nominatim" | "openstreetmap";
}

export interface OpenCageGeocoderProviderFactoryOptions
  extends RestrictedProviderOptionInterface,
    OpenCageProviderOptionsInterface {
  provider: "opencage";
}

export interface YandexGeocoderProviderFactoryOptions
  extends RestrictedProviderOptionInterface,
    YandexProviderOptionsInterface {
  provider: "yandex";
}

export type GeocoderProvider =
  | BingProvider
  | ChainProvider
  | GeoPluginProvider
  | GoogleMapsProvider
  | LocationIQProvider
  | MapboxProvider
  | MapQuestProvider
  | NominatimProvider
  | OpenCageProvider
  | YandexProvider;

export default class ProviderFactory {
  public static createProvider(
    options: "chain" | ChainGeocoderProviderFactoryOptions
  ): ChainProvider;

  public static createProvider(
    options:
      | "bing"
      | "bingmaps"
      | "microsoft"
      | BingGeocoderProviderFactoryOptions
  ): BingProvider;

  public static createProvider(
    options: "geoplugin" | GeoPluginGeocoderProviderFactoryOptions
  ): GeoPluginProvider;

  public static createProvider(
    options: "google" | "googlemaps" | GoogleMapsGeocoderProviderFactoryOptions
  ): GoogleMapsProvider;

  public static createProvider(
    options: "locationiq" | LocationIQGeocoderProviderFactoryOptions
  ): LocationIQProvider;

  public static createProvider(
    options: "mapbox" | MapboxGeocoderProviderFactoryOptions
  ): MapboxProvider;

  public static createProvider(
    options: "mapquest" | MapQuestGeocoderProviderFactoryOptions
  ): MapQuestProvider;

  public static createProvider(
    options:
      | "nominatim"
      | "openstreetmap"
      | NominatimGeocoderProviderFactoryOptions
  ): NominatimProvider;

  public static createProvider(
    options: "opencage" | OpenCageGeocoderProviderFactoryOptions
  ): OpenCageProvider;

  public static createProvider(
    options: "yandex" | YandexGeocoderProviderFactoryOptions
  ): YandexProvider;

  public static createProvider<O extends RestrictedProviderOptionInterface>(
    options: ProviderName | O
  ): GeocoderProvider;

  public static createProvider<O extends ProviderOptionInterface>(
    options: string | O
  ): ProviderInterface<Geocoded> | undefined;

  /**
   * Creates Geocoder Provider instances.
   * @param options
   *   Either a string representing the registered provider, or an object with the
   *   following settings for instigating providers:
   *     - provider: A string representing the registered provider.
   * @return
   *   An object compatible with ProviderInterface, or undefined if there's not a
   *   registered provider.
   */
  public static createProvider<O extends RestrictedProviderOptionInterface>(
    options: ProviderName | O
  ): GeocoderProvider | undefined {
    const createProviderOptions = {
      ...defaultProviderOptions,
      ...(typeof options === "string" ? { provider: options } : options),
    };

    const externalLoader = new ExternalLoader();

    const { provider, ...providerOptions } = createProviderOptions;
    switch (provider) {
      case "bing":
      case "bingmaps":
      case "microsoft":
        return new BingProvider(externalLoader, {
          ...defaultBingProviderOptions,
          ...providerOptions,
        });
      case "chain":
        return new ChainProvider({
          ...defaultChainProviderOptions,
          ...providerOptions,
        });
      case "geoplugin":
        return new GeoPluginProvider(externalLoader, providerOptions);
      case "google":
      case "googlemaps":
        return new GoogleMapsProvider(externalLoader, providerOptions);
      case "locationiq":
        return new LocationIQProvider(externalLoader, {
          ...defaultLocationIQProviderOptions,
          ...providerOptions,
        });
      case "mapbox":
        return new MapboxProvider(externalLoader, {
          ...defaultMapboxProviderOptions,
          ...providerOptions,
        });
      case "mapquest":
        return new MapQuestProvider(externalLoader, {
          ...defaultMapQuestProviderOptions,
          ...providerOptions,
        });
      case "openstreetmap":
      case "nominatim":
        return new NominatimProvider(externalLoader, {
          ...defaultNominatimProviderOptions,
          ...providerOptions,
        });
      case "opencage":
        return new OpenCageProvider(externalLoader, {
          ...defaultOpenCageProviderOptions,
          ...providerOptions,
        });
      case "yandex":
        return new YandexProvider(externalLoader, {
          ...defaultYandexProviderOptions,
          ...providerOptions,
        });
      default:
    }

    return undefined;
  }
}
