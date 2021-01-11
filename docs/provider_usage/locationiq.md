# LocationIQ Usage

## Options

- `countryCodes`: to restrict the results to one or more countries (ISO 3166 alpha 2 country codes)
- `source` (default: "locationiq"): set it to "nominatim" to have only results from OpenStreetMap data

## `geocode` parameters

- `countryCodes`: to restrict the results to one or more countries (ISO 3166 alpha 2 country codes)
- `excludePlaceIds`: for excluding some OpenStreetMap objects from the results
- `bounded` (only if `bounds` is used): boolean to restrict the results to items within the bounds
- `dedupe`: boolean to remove the duplicates

## `geodecode` parameters

- `zoom` (default: 18, from 0 to 18): the level of details required for the address

## `Geocoded` properties

- `placeId`: an internal identifier
- `displayName`: full comma-separated address
- `osmId`, `osmType`: reference to the OpenStreetMap object
- `categories`: keys of the main OpenStreetMap tag (only one)
- `types`: values of the main OpenStreetMap tag (only one)
- `precision`: the most granular address element that matches the geocoding query
- `precisionCode`: the quality of the returned address
- `precisionType`: the quality of the returned location match
- `attribution`: licensing information
- `subLocalityLevels`: levels for the sublocality (greater level number means smaller area)
