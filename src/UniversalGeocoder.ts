import {
  BingProvider,
  ChainProvider,
  GeoPluginProvider,
  GoogleMapsProvider,
  LocationIQProvider,
  MapboxProvider,
  MapQuestProvider,
  NominatimProvider,
  OpenCageProvider,
  ProviderInterface,
  YandexProvider,
} from "provider";
import Geocoded from "Geocoded";
import ProviderFactory, {
  BingGeocoderProviderFactoryOptions,
  ChainGeocoderProviderFactoryOptions,
  GeoPluginGeocoderProviderFactoryOptions,
  GoogleMapsGeocoderProviderFactoryOptions,
  LocationIQGeocoderProviderFactoryOptions,
  MapboxGeocoderProviderFactoryOptions,
  MapQuestGeocoderProviderFactoryOptions,
  NominatimGeocoderProviderFactoryOptions,
  OpenCageGeocoderProviderFactoryOptions,
  ProviderOptionInterface,
  RestrictedProviderOptionInterface,
  YandexGeocoderProviderFactoryOptions,
} from "GeocoderProviderFactory";
import type { ProviderName as GeocoderName } from "GeocoderProviderFactory";

export type Geocoder = ProviderInterface<Geocoded>;

export type { GeocoderName };

export default class UniversalGeocoder {
  public version = "0.1.0";

  public static createGeocoder(
    options: "chain" | ChainGeocoderProviderFactoryOptions
  ): ChainProvider;

  public static createGeocoder(
    options:
      | "bing"
      | "bingmaps"
      | "microsoft"
      | BingGeocoderProviderFactoryOptions
  ): BingProvider;

  public static createGeocoder(
    options: "geoplugin" | GeoPluginGeocoderProviderFactoryOptions
  ): GeoPluginProvider;

  public static createGeocoder(
    options: "google" | "googlemaps" | GoogleMapsGeocoderProviderFactoryOptions
  ): GoogleMapsProvider;

  public static createGeocoder(
    options: "locationiq" | LocationIQGeocoderProviderFactoryOptions
  ): LocationIQProvider;

  public static createGeocoder(
    options: "mapbox" | MapboxGeocoderProviderFactoryOptions
  ): MapboxProvider;

  public static createGeocoder(
    options: "mapquest" | MapQuestGeocoderProviderFactoryOptions
  ): MapQuestProvider;

  public static createGeocoder(
    options:
      | "nominatim"
      | "openstreetmap"
      | NominatimGeocoderProviderFactoryOptions
  ): NominatimProvider;

  public static createGeocoder(
    options: "opencage" | OpenCageGeocoderProviderFactoryOptions
  ): OpenCageProvider;

  public static createGeocoder(
    options: "yandex" | YandexGeocoderProviderFactoryOptions
  ): YandexProvider;

  public static createGeocoder<O extends RestrictedProviderOptionInterface>(
    options: GeocoderName | O
  ): Geocoder;

  public static createGeocoder<O extends ProviderOptionInterface>(
    options: string | O
  ): ProviderInterface<Geocoded> | undefined;

  public static createGeocoder<O extends RestrictedProviderOptionInterface>(
    options: GeocoderName | O
  ): Geocoder | undefined {
    return ProviderFactory.createProvider(options);
  }
}
