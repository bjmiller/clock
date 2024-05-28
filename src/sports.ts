import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from 'dayjs/plugin/isToday';

import {
  NHLDailySchedule,
  GameLine,
  NHLGame,
  NHLTvBroadcast,
  NHLMarket,
  MLBGame,
  MLBMarket,
  MLBBroadcast,
  MLBBroadcastType,
  MLBSchedule,
  Month
} from './sportsTypes';

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(isToday);

const trackingNHLTeamAbbreviations = ['NYI', 'NYR'];
const trackingMLBTeamAbbreviations = ['NYM'];

const formatNhlTvNetworks = (broadcasts: NHLTvBroadcast[], market: NHLMarket) => {
  return broadcasts
    .filter((tv) => tv.countryCode === 'US' && (tv.market === market || tv.market === NHLMarket.Neutral))
    .sort((l, r) => {
      if (l.market === NHLMarket.Neutral && r.market !== NHLMarket.Neutral) {
        return 1;
      }
      if (l.market !== NHLMarket.Neutral && r.market === NHLMarket.Neutral) {
        return -1;
      }
      return 0;
    })
    .map((tv) => tv.network);
};

const formatMLBNetworks = (broadcasts: MLBBroadcast[], market: MLBMarket) => {
  return broadcasts
    .filter((b) => b.type === MLBBroadcastType.TV && b.homeAway === market)
    .sort((l, r) => {
      if (l.isNational && !r.isNational) {
        return 1;
      }
      if (!l.isNational && r.isNational) {
        return -1;
      }
      return 0;
    })
    .map((tv) => tv.name);
};

const isNHLGame = (game: NHLGame | MLBGame): game is NHLGame => {
  return (game as NHLGame).periodDescriptor != null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isMLBGame = (game: NHLGame | MLBGame): game is MLBGame => {
  return (game as MLBGame).gamePk != null;
};

const toGameLine = (game: NHLGame | MLBGame) => {
  let gameLine: GameLine;

  if (isNHLGame(game)) {
    const trackingMarket = trackingNHLTeamAbbreviations.includes(game.homeTeam.abbrev)
      ? NHLMarket.Home
      : NHLMarket.Away;
    gameLine = {
      league: 'NHL',
      date: dayjs.utc(game.startTimeUTC).local().format('YYYY-MM-DD'),
      homeTeam: game.homeTeam.abbrev,
      awayTeam: game.awayTeam.abbrev,
      gameState: game.gameState,
      gameTime: dayjs.utc(game.startTimeUTC).local().format('h:mm A'),
      networks: formatNhlTvNetworks(game.tvBroadcasts, trackingMarket),
      awayScore: game.awayTeam.score || null,
      homeScore: game.homeTeam.score || null
    };
  } else {
    const trackingMarket = trackingMLBTeamAbbreviations.includes(game.teams.home.team.abbreviation)
      ? MLBMarket.Home
      : MLBMarket.Away;
    gameLine = {
      league: 'MLB',
      date: dayjs.utc(game.gameDate).local().format('YYYY-MM-DD'),
      homeTeam: game.teams.home.team.abbreviation,
      awayTeam: game.teams.away.team.abbreviation,
      gameState: game.status.abstractGameCode,
      gameTime: dayjs.utc(game.gameDate).local().format('h:mm A'),
      networks: formatMLBNetworks(game.broadcasts, trackingMarket),
      homeScore: game.teams.home.score || null,
      awayScore: game.teams.away.score || null
    };
  }
  return gameLine;
};

const filterNHLGames = (schedule: NHLDailySchedule) => {
  return schedule.gameWeek[0].games.filter(
    (game) =>
      trackingNHLTeamAbbreviations.includes(game.homeTeam.abbrev) ||
      trackingNHLTeamAbbreviations.includes(game.awayTeam.abbrev)
  );
};

const filterMLBGames = (schedule: MLBSchedule) => {
  return schedule.dates[0].games.filter(
    (game) =>
      trackingMLBTeamAbbreviations.includes(game.teams.home.team.abbreviation) ||
      trackingMLBTeamAbbreviations.includes(game.teams.away.team.abbreviation)
  );
};

const fetchNHLGames = async () => {
  let response: Response;
  try {
    response = await fetch('https://api-web.nhle.com/v1/schedule/now', { cache: 'no-cache' });
  } catch (error) {
    console.error(`fetchNHLGames: failed to fetch response - ${error}`);
    return null;
  }
  let schedule: NHLDailySchedule;
  try {
    schedule = await response.json();
  } catch (error) {
    console.error(`fetchNHLGames: failed to extract JSON from response body - ${error}`);
    return null;
  }
  const gameLines = filterNHLGames(schedule).map(toGameLine);
  localStorage.setItem('todaysNHLGameLines', JSON.stringify(gameLines));
  return schedule;
};

const fetchMLBGames = async () => {
  let response: Response;
  try {
    response = await fetch('http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&hydrate=team,broadcasts', {
      cache: 'no-cache'
    });
  } catch (error) {
    console.error(`fetchMLBGames: failed to fetch response - ${error}`);
    return null;
  }
  let schedule: MLBSchedule;
  try {
    schedule = await response.json();
  } catch (error) {
    console.error(`fetchMLBGames: failed to extract JSON from response body - ${error}`);
    return null;
  }
  const gameLines = filterMLBGames(schedule).map(toGameLine);
  localStorage.setItem('todaysMLBGameLines', JSON.stringify(gameLines));
  return schedule;
};

const renderGame = (game: GameLine) => {
  /* eslint-disable prettier/prettier */
  return `
    <tbody>
      <tr class="sports-top-line">
        <td class="sports-teams" colspan="2">
          <span class="team ${game.homeTeam.toLowerCase()}">${game.homeTeam}</span> - <span class="team ${game.awayTeam.toLowerCase()}">
            ${game.awayTeam}
          </span>
        </td>
      </tr>
      <tr>
        <td class="sports-time">
          ${game.gameTime}
        </td>
        <td class="sports-networks">
          ${game.networks.join(', ')}
        </td>
      </tr>
    </tbody>
  `;
  /* eslint-enable prettier/prettier */
};

const getSports = () => {
  let nhlGameLines: GameLine[] = [];
  let mlbGameLines: GameLine[] = [];

  try {
    nhlGameLines = JSON.parse(localStorage.getItem('todaysNHLGameLines') ?? '[]');
  } catch (e) {
    // Do nothing
  }
  try {
    mlbGameLines = JSON.parse(localStorage.getItem('todaysMLBGameLines') ?? '[]');
  } catch (e) {
    // Do nothing
  }
  return [...nhlGameLines, ...mlbGameLines].sort((l, r) => {
    const ltime = dayjs(`${l.date} ${l.gameTime}`, 'YYYY-MM-DD h:mm A');
    const rtime = dayjs(`${r.date} ${r.gameTime}`, 'YYYY-MM-DD h:mm A');
    if (ltime.isBefore(rtime)) {
      return -1;
    }
    if (ltime.isAfter(rtime)) {
      return 1;
    }
    return 0;
  });
};

const writeSports = () => {
  try {
    const lines = getSports();
    const table = document.getElementById('sports-schedule');
    if (table != null) {
      table.innerHTML = lines.map(renderGame).join('');
    }
  } catch (error) {
    console.error(`writeSports: Unable to get sports data - ${error}`);
  }
};

const fetchAndWriteSports = async () => {
  const now = dayjs();
  const isNHLSeason = now.month() >= Month.October || now.month() <= Month.June;
  const isMLBSeason = now.month() >= Month.March && now.month() <= Month.November;
  // eslint-disable-next-line no-magic-numbers
  if (isNHLSeason) {
    await fetchNHLGames();
  }
  if (isMLBSeason) {
    await fetchMLBGames();
  }
  localStorage.setItem('sportsLastCheck', String(new Date().getTime()));
  writeSports();
};

export const sports = async () => {
  await fetchAndWriteSports();
  const minutes = 15;
  const delayMs = dayjs.duration({ minutes }).asMilliseconds();
  setInterval(fetchAndWriteSports, delayMs);
};
