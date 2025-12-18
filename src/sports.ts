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
  Month,
  PWHLGame,
  PWHLSchedule,
  PWHLVideo
} from './sportsTypes';

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(isToday);

const trackingNHLTeamAbbreviations = ['NYI', 'NYR'];
const trackingMLBTeamAbbreviations = ['NYM'];
const trackingPWHLTeamAbbreviations = ['NY'];

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

const formatPWHLNetworks = (broadcasts: PWHLVideo[]) => {
  // This is hacky, but they don't tell us much more about the broadcaster than the name.
  return broadcasts
    .filter((b) => b.name.toLowerCase().includes('msg') || b.name.toLowerCase().includes('prime'))
    .sort((l, r) => {
      if (l.name.toLowerCase().includes('msg') && !r.name.toLowerCase().includes('msg')) {
        return 1;
      }
      if (!l.name.toLowerCase().includes('msg') && r.name.toLowerCase().includes('msg')) {
        return -1;
      }
      return 0;
    })
    .map((b) => b.name);
};

const isNHLGame = (game: NHLGame | MLBGame | PWHLGame): game is NHLGame => {
  return (game as NHLGame).periodDescriptor != null;
};

const isMLBGame = (game: NHLGame | MLBGame | PWHLGame): game is MLBGame => {
  return (game as MLBGame).gamePk != null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isPWHLGame = (game: NHLGame | MLBGame | PWHLGame): game is PWHLGame => {
  return (game as PWHLGame)?.client_code === 'pwhl';
};

const toGameLine = (game: NHLGame | MLBGame | PWHLGame) => {
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
  } else if (isMLBGame(game)) {
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
  } else {
    gameLine = {
      league: 'PWHL',
      date: dayjs.utc(game.GameDateISO8601).local().format('YYYY-MM-DD'),
      homeTeam: game.home_team_code,
      awayTeam: game.visiting_team_code,
      gameState: game.game_status,
      gameTime: dayjs.utc(game.GameDateISO8601).local().format('h:mm A'),
      networks: formatPWHLNetworks([
        ...(game.broadcasters.home_video ?? []),
        ...(game.broadcasters.home_video_fr ?? []),
        ...(game.broadcasters.home_webcast ?? []),
        ...(game.broadcasters.visiting_video ?? [])
      ]),
      homeScore: Number(game.home_goal_count),
      awayScore: Number(game.visiting_goal_count)
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
  return (
    schedule.dates?.[0]?.games?.filter(
      (game) =>
        trackingMLBTeamAbbreviations.includes(game.teams.home.team.abbreviation) ||
        trackingMLBTeamAbbreviations.includes(game.teams.away.team.abbreviation)
    ) ?? []
  );
};

const filterPWHLGames = (schedule: PWHLSchedule) => {
  return (
    schedule?.SiteKit?.Schedule?.filter(
      (game) =>
        (trackingPWHLTeamAbbreviations.includes(game.home_team_code) ||
          trackingPWHLTeamAbbreviations.includes(game.visiting_team_code)) &&
        dayjs.utc(game.GameDateISO8601).local().isToday()
    ) ?? []
  );
};

const fetchNHLGames = async () => {
  let response: Response;
  try {
    response = await fetch(`https://api-web.nhle.com/v1/schedule/${dayjs().format('YYYY-MM-DD')}`, {
      cache: 'no-cache'
    });
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

const fetchPWHLGames = async () => {
  // Since the PWHL uses Hockeytech, it makes more sense to pull the whole season schedule, so it includes broadcasters.
  const pwhlKey = '446521baf8c38984';
  let response: Response;
  try {
    response = await fetch(
      `https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=schedule&key=${pwhlKey}&client_code=pwhl&lang=en`
    );
  } catch (error) {
    console.error(`fetchPWHLGames: failed to fetch response - ${error}`);
    return null;
  }
  let schedule: PWHLSchedule;
  try {
    schedule = await response.json();
  } catch (error) {
    console.error(`fetchPWHLGames: failed to extract JSON from response body - ${error}`);
    return null;
  }
  const gameLines = filterPWHLGames(schedule).map(toGameLine);
  localStorage.setItem('todaysPWHLGameLines', JSON.stringify(gameLines));
  return schedule;
};

const renderGame = (game: GameLine) => {
  /* eslint-disable prettier/prettier */
  return `
    <tbody class="${game.league.toLowerCase()}">
      <tr class="sports-top-line">
        <td class="sports-teams" colspan="2">
          <span class="team ${game.league.toLowerCase()} ${game.awayTeam.toLowerCase()}">${game.awayTeam}</span>
          - 
          <span class="team ${game.league.toLowerCase()} ${game.homeTeam.toLowerCase()}">${game.homeTeam}</span>
        </td>
      </tr>
      <tr class="sports-bottom-line">
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

const isNotOld = (game: GameLine) => {
  const now = dayjs();
  const gameTime = dayjs(dayjs(`${game.date} ${game.gameTime}`, 'YYYY-MM-DD h:mm A'));
  // eslint-disable-next-line no-magic-numbers
  return !(!gameTime.isToday() && now.isAfter(gameTime.add(4, 'hours')));
};

const getSports = () => {
  let nhlGameLines: GameLine[] = [];
  let mlbGameLines: GameLine[] = [];
  let pwhlGameLines: GameLine[] = [];

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
  try {
    pwhlGameLines = JSON.parse(localStorage.getItem('todaysPWHLGameLines') ?? '[]');
  } catch (e) {
    // Do nothing
  }
  return [...nhlGameLines, ...mlbGameLines, ...pwhlGameLines].filter(isNotOld).sort((l, r) => {
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
  const isPWHLSeason = now.month() >= Month.November || now.month() <= Month.May;
  // eslint-disable-next-line no-magic-numbers
  if (isNHLSeason) {
    await fetchNHLGames();
  }
  if (isMLBSeason) {
    await fetchMLBGames();
  }
  if (isPWHLSeason) {
    await fetchPWHLGames();
  }
  writeSports();
};

export const sports = async () => {
  await fetchAndWriteSports();
  const minutes = 15;
  const delayMs = dayjs.duration({ minutes }).asMilliseconds();
  setInterval(fetchAndWriteSports, delayMs);
};
