/* eslint-disable no-shadow */
export interface GameLine {
  league: 'NHL' | 'MLB';
  date: string;
  homeTeam: string;
  awayTeam: string;
  gameTime: string;
  gameState: string;
  networks: string[];
  homeScore: number | null;
  awayScore: number | null;
}

export enum Month {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

export interface NHLDailySchedule {
  previousStartDate: string;
  gameWeek: NHLGameWeek[];
  oddsPartners: NHLOddsPartner[];
  preSeasonStartDate: string;
  regularSeasonStartDate: string;
  regularSeasonEndDate: string;
  playoffEndDate: string;
  numberOfGames: number;
}

export interface NHLGameWeek {
  date: string;
  dayAbbrev: string;
  numberOfGames: number;
  games: NHLGame[];
}

export interface NHLGame {
  id: number;
  season: number;
  gameType: number;
  venue: NHLVenue;
  neutralSite: boolean;
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  venueTimezone: string;
  gameState: NHLGameState;
  gameScheduleState: string;
  tvBroadcasts: NHLTvBroadcast[];
  awayTeam: NHLTeam;
  homeTeam: NHLTeam;
  periodDescriptor: NHLPeriodDescriptor;
  gameOutcome?: NHLGameOutcome;
  winningGoalie?: NHLNotablePlayer;
  winningGoalScorer?: NHLNotablePlayer;
  gameCenterLink: string;
  specialEvent?: NHLSpecialEvent;
  threeMinRecap?: string;
  threeMinRecapFr?: string;
  specialEventLogo?: string;
  ticketsLink?: string;
}

export interface NHLTeam {
  id: number;
  placeName: NHLPlaceName;
  abbrev: string;
  logo: string;
  darkLogo: string;
  awaySplitSquad?: boolean;
  score?: number;
  airlineLink?: string;
  airlineDesc?: string;
  hotelLink?: string;
  hotelDesc?: string;
  radioLink?: string;
  promoLink?: string;
  promoDesc?: string;
  homeSplitSquad?: boolean;
  odds?: NHLOdds[];
}

export interface NHLOdds {
  providerId: number;
  value: string;
}

export interface NHLVenue {
  default: string;
  fr?: string;
  es?: string;
}

export enum NHLGameState {
  Final = 'FINAL',
  Future = 'FUT',
  Live = 'LIVE',
  Official = 'OFF'
}

export interface NHLPlaceName {
  default: string;
  fr?: string;
}

export interface NHLPeriodDescriptor {
  number?: number;
  periodType?: string;
}

export interface NHLSeriesStatus {
  round: number;
  seriesLetter: string;
  neededToWin: number;
  topSeedWins: number;
  bottomSeedWins: number;
  gameNumberOfSeries: number;
}

export interface NHLTvBroadcast {
  id: number;
  market: NHLMarket;
  countryCode: NHLCountryCode;
  network: string;
  sequenceNumber: number;
}

export enum NHLCountryCode {
  Canada = 'CA',
  UnitedStates = 'US'
}

export enum NHLMarket {
  Away = 'A',
  Home = 'H',
  Neutral = 'N'
}

export interface NHLOddsPartner {
  partnerId: number;
  country: string;
  name: string;
  imageUrl: string;
  siteUrl?: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
}

export interface NHLNotablePlayer {
  playerId: number;
  firstInitial: { default: string };
  lastName: NHLLastName;
}

export interface NHLLastName {
  default: string;
  cs?: string;
  fi?: string;
  sk?: string;
}

export interface NHLGameOutcome {
  lastPeriodType: NHLPeriodType;
}

export enum NHLPeriodType {
  Overtime = 'OT',
  Regulation = 'REG',
  Shootout = 'SO'
}

export interface NHLSpecialEvent {
  default: string;
}

export interface MLBSchedule {
  copyright: string;
  totalItems: number;
  totalEvents: number;
  totalGames: number;
  totalGamesInProgress: number;
  dates?: MLBDate[];
}

export interface MLBDate {
  date: string;
  totalItems: number;
  totalEvents: number;
  totalGames: number;
  totalGamesInProgress: number;
  games?: MLBGame[];
  events: unknown[];
}

export interface MLBGame {
  gamePk: number;
  gameGuid: string;
  link: string;
  gameType: MLBGameType;
  season: string;
  gameDate: string;
  officialDate: string;
  status: MLBGameStatus;
  teams: MLBTeams;
  venue: MLBVenue;
  content: MLBContent;
  isTie?: boolean;
  gameNumber: number;
  publicFacing: boolean;
  doubleHeader: MLBDoubleHeader;
  gamedayType: string;
  tiebreaker: MLBBinaryChoice;
  calendarEventID: string;
  seasonDisplay: string;
  dayNight: string;
  scheduledInnings: number;
  reverseHomeAwayStatus: boolean;
  inningBreakLength: number;
  gamesInSeries: number;
  seriesGameNumber: number;
  seriesDescription: string;
  recordSource: string; // The character here clearly means something, but it's not documented amywhere.
  ifNecessary: MLBBinaryChoice;
  ifNecessaryDescription: string;
  description?: string;
  rescheduleDate?: string;
  rescheduleGameDate?: string;
  rescheduledFrom?: string;
  rescheduledFromDate?: string;
  broadcasts: MLBBroadcast[];
}

export interface MLBBroadcast {
  id: number;
  name: string;
  type: MLBBroadcastType;
  language: string;
  isNational: boolean;
  callSign: string;
  videoResolution?: MLBBroadcastVideoResolution;
  mediaState: MLBBroadcastMediaState;
  broadcastDate: string;
  mediaId: string;
  gameDateBroadcastGuid: string;
  homeAway: MLBMarket;
  freeGame: boolean;
  availableForStreaming: boolean;
  postGameShow: boolean;
  mvpdAuthRequired: boolean;
  preGameShow?: string;
  availability?: MLBBroadcastAvailability;
}

export interface MLBBroadcastAvailability {
  availabilityId: number;
  availabilityCode: string;
  availabilityText: string;
}

export enum MLBMarket {
  Away = 'away',
  Home = 'home'
}

export interface MLBBroadcastMediaState {
  mediaStateId: number;
  mediaStateCode: string;
  mediaStateText: string;
}

export enum MLBBroadcastType {
  AM = 'AM',
  FM = 'FM',
  TV = 'TV'
}

export interface MLBBroadcastVideoResolution {
  code: string;
  resolutionShort: string;
  resolutionFull: string;
}

export interface MLBContent {
  link: string;
}

export enum MLBBinaryChoice {
  Yes = 'Y',
  No = 'N'
}

export enum MLBDoubleHeader {
  Yes = 'Y',
  No = 'N',
  Split = 'S'
}

export enum MLBGameType {
  RegularSeason = 'R',
  SpringTraining = 'S',
  WildCardGame = 'F',
  DivisionSeries = 'D',
  LeagueChampionshipSeries = 'L',
  WorldSeries = 'W',
  Championship = 'C',
  NineteenthCenturySeries = 'N',
  Playoffs = 'P',
  AllStarGame = 'A',
  Intrasquad = 'I',
  Exhibition = 'E'
}

export interface MLBGameStatus {
  abstractGameState: string;
  codedGameState: string;
  detailedState: string;
  statusCode: string;
  startTimeTBD: boolean;
  reason?: string;
  abstractGameCode: MLBAbstractGameCode;
}

export enum MLBAbstractGameCode {
  Final = 'F',
  Live = 'L',
  Other = 'O',
  Preview = 'P'
}

export interface MLBTeams {
  away: MLBTeam;
  home: MLBTeam;
}

export interface MLBTeam {
  leagueRecord: MLBLeagueRecord;
  score?: number;
  team: MLBTeamDetails;
  isWinner?: boolean;
  splitSquad: boolean;
  seriesNumber: number;
  springLeague: MLBVenue;
}

export interface MLBLeagueRecord {
  wins: number;
  losses: number;
  pct: string;
}

export interface MLBVenue {
  id: number;
  name: string;
  link: string;
  abbreviation?: string;
}

export interface MLBTeamDetails {
  springLeague: MLBVenue;
  allStarStatus: MLBDoubleHeader;
  id: number;
  name: string;
  link: string;
  season: number;
  venue: MLBVenue;
  springVenue: MLBSpringVenue;
  teamCode: string;
  fileCode: string;
  abbreviation: string;
  teamName: string;
  locationName: string;
  firstYearOfPlay: string;
  league: MLBVenue;
  division: MLBVenue;
  sport: MLBVenue;
  shortName: string;
  franchiseName: string;
  clubName: string;
  active: boolean;
}

export interface MLBSpringVenue {
  id: number;
  link: string;
}
