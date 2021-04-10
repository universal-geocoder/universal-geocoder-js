# OpenStreetMap (Nominatim) Usage

## Options

- `userAgent` (required if default host): a User-Agent identifying your application is needed to use Nominatim (see https://operations.osmfoundation.org/policies/nominatim/)
- `referer`: if you want to set a Referer as well
- `host` (default: "nominatim.openstreetmap.org"): to use another host
- `countryCodes`: to restrict the results to one or more countries (ISO 3166 alpha 2 country codes)

## `geocode` parameters

- `countryCodes`: to restrict the results to one or more countries (ISO 3166 alpha 2 country codes)
- `excludePlaceIds`: for excluding some OpenStreetMap objects from the results
- `bounded` (only if `bounds` is used): boolean to restrict the results to items within the bounds
- `dedupe`: boolean to remove the duplicates
- `shape` (possible values: "geojson", "kml", "svg", "text"): add the shape (geometry) to the results in the specified format
- `shapeThreshold`: Tolerance in degrees for simplifying the returned shape

## `geodecode` parameters

- `zoom` (default: 18, from 0 to 18): the level of details required for the address
- `shape` (possible values: "geojson", "kml", "svg", "text"): add the shape (geometry) to the results in the specified format
- `shapeThreshold`: Tolerance in degrees for simplifying the returned shape

## `Geocoded` properties

- `displayName`: full comma-separated address
- `osmId`, `osmType`: reference to the OpenStreetMap object
- `categories`: keys of the main OpenStreetMap tag (only one)
- `types`: values of the main OpenStreetMap tag (only one)
- `attribution`: OpenStreetMap licensing information
- `subLocalityLevels`: levels for the sublocality (greater level number means smaller area)
- `shape`: shape (geometry) of the result if asked
