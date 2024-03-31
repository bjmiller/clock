export interface Weather {
  id: string;
  'v3-wx-observations-current': V3WxObservationsCurrent;
  'v3-wx-forecast-daily-10day': V3WxForecastDaily10Day;
  'v3-location-point': V3LocationPoint;
}

export interface V3LocationPoint {
  location: WxLocation;
}

export interface WxLocation {
  latitude: number;
  longitude: number;
  city: string;
  locale: Locale;
  neighborhood: string;
  adminDistrict: string;
  adminDistrictCode: string;
  postalCode: string;
  postalKey: string;
  country: string;
  countryCode: string;
  ianaTimeZone: string;
  displayName: string;
  dstEnd: string;
  dstStart: string;
  dmaCd: string;
  placeId: string;
  disputedArea: boolean;
  disputedCountries: null;
  disputedCountryCodes: null;
  disputedCustomers: null;
  disputedShowCountry: boolean[];
  canonicalCityId: string;
  countyId: string;
  locId: string;
  locationCategory: null;
  pollenId: string;
  pwsId: string;
  regionalSatellite: string;
  tideId: string;
  type: string;
  zoneId: string;
}

export interface Locale {
  locale1: string;
  locale2: string | null;
  locale3: string | null;
  locale4: string | null;
}

export interface V3WxForecastDaily10Day {
  calendarDayTemperatureMax: number[];
  calendarDayTemperatureMin: number[];
  dayOfWeek: string[];
  expirationTimeUtc: number[];
  moonPhase: string[];
  moonPhaseCode: string[];
  moonPhaseDay: number[];
  moonriseTimeLocal: string[];
  moonriseTimeUtc: number[];
  moonsetTimeLocal: string[];
  moonsetTimeUtc: Array<number | null>;
  narrative: string[];
  qpf: number[];
  qpfSnow: number[];
  sunriseTimeLocal: string[];
  sunriseTimeUtc: number[];
  sunsetTimeLocal: string[];
  sunsetTimeUtc: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  validTimeLocal: string[];
  validTimeUtc: number[];
  daypart: Daypart[];
}

export interface Daypart {
  cloudCover: number[];
  dayOrNight: DayOrNight[];
  daypartName: string[];
  iconCode: number[];
  iconCodeExtend: number[];
  narrative: string[];
  precipChance: number[];
  precipType: string[];
  qpf: number[];
  qpfSnow: number[];
  qualifierCode: Array<null | string>;
  qualifierPhrase: Array<null | string>;
  relativeHumidity: number[];
  snowRange: string[];
  temperature: number[];
  temperatureHeatIndex: number[];
  temperatureWindChill: number[];
  thunderCategory: string[];
  thunderIndex: number[];
  uvDescription: string[];
  uvIndex: number[];
  windDirection: number[];
  windDirectionCardinal: string[];
  windPhrase: string[];
  windSpeed: number[];
  wxPhraseLong: string[];
  wxPhraseShort: string[];
}

export type DayOrNight = 'D' | 'N';

export interface V3WxObservationsCurrent {
  cloudCeiling: number;
  cloudCoverPhrase: string;
  dayOfWeek: string;
  dayOrNight: DayOrNight;
  expirationTimeUtc: number;
  iconCode: number;
  iconCodeExtend: number;
  obsQualifierCode: null;
  obsQualifierSeverity: null;
  precip1Hour: number;
  precip6Hour: number;
  precip24Hour: number;
  pressureAltimeter: number;
  pressureChange: number;
  pressureMeanSeaLevel: number;
  pressureTendencyCode: number;
  pressureTendencyTrend: string;
  relativeHumidity: number;
  snow1Hour: number;
  snow6Hour: number;
  snow24Hour: number;
  sunriseTimeLocal: string;
  sunriseTimeUtc: number;
  sunsetTimeLocal: string;
  sunsetTimeUtc: number;
  temperature: number;
  temperatureChange24Hour: number;
  temperatureDewPoint: number;
  temperatureFeelsLike: number;
  temperatureHeatIndex: number;
  temperatureMax24Hour: number;
  temperatureMaxSince7Am: number;
  temperatureMin24Hour: number;
  temperatureWindChill: number;
  uvDescription: string;
  uvIndex: number;
  validTimeLocal: string;
  validTimeUtc: number;
  visibility: number;
  windDirection: number;
  windDirectionCardinal: DayOrNight;
  windGust: null;
  windSpeed: number;
  wxPhraseLong: string;
  wxPhraseMedium: string;
  wxPhraseShort: string;
}
