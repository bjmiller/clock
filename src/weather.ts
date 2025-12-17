import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Weather } from './weatherTypes';
import { session } from 'electron';

dayjs.extend(duration);

const icons: string[] = [];

const numberOfIcons = 48;
for (let i = 0; i < numberOfIcons; i++) {
  icons[i] = require(`./icons/${i}`);
}

const fetchWxApiKey = async () => {
  const wxUrl = 'https://www.wunderground.com/';
  const html = await fetch(wxUrl).then((res) => res.text());
  const parser = new DOMParser();
  let wxDoc: Document;
  try {
    wxDoc = parser.parseFromString(html, 'text/html');
  } catch (error) {
    console.error('fetchWxApiKey: DOMParser could not parse response');
    return null;
  }
  const appRootStateScript = wxDoc.getElementById('app-root-state');
  if (appRootStateScript == null) {
    console.error('fetchWxApiKey: no appRootStateScript');
    return null;
  }
  const appRootStateText = appRootStateScript.innerText;
  let appRootState: { 'process.env': { [k: string]: string } };
  try {
    appRootState = JSON.parse(appRootStateText);
  } catch (error) {
    console.error('fetchWxApiKey: Could not parse appRootState as JSON');
    console.error('APPROOTSTATE', appRootStateText);
    return null;
  }
  let wxApiKey: string;
  try {
    wxApiKey = appRootState['process.env']?.SUN_API_KEY;
  } catch (error) {
    console.error('fetchWxApiKey: Could not read SUN_API_KEY');
    return null;
  }
  if (wxApiKey == null) {
    console.error('fetchWxApiKey: SUN_API_KEY is null/undefined');
  }
  sessionStorage.setItem('wxApiKey', wxApiKey);
  return wxApiKey;
};

const getWxApiKey = async () => {
  const wxApiKey = sessionStorage.getItem('wxApiKey');
  if (wxApiKey != null) {
    return wxApiKey;
  }
  return await fetchWxApiKey();
};

const fetchWeather = async () => {
  const wxApiKey = await getWxApiKey();
  if (wxApiKey == null) {
    console.error('fetchWeather: No Wx API key!');
    return null;
  }
  const calcWxApiUrl = (apiKey: string) =>
    `https://api.weather.com/v3/aggcommon/v3-wx-observations-current;v3-wx-forecast-daily-10day;v3-location-point?apiKey=${apiKey}&geocodes=40.70%2C-74.40&language=en-US&units=e&format=json`;
  let wxResponse: Response;
  try {
    wxResponse = await fetch(calcWxApiUrl(wxApiKey));
  } catch (error) {
    console.error(`fetchWeather: Failed to fetch - ${error}`);
    return null;
  }
  let cacheControlMaxAge = 0;
  const cacheControl = wxResponse.headers.get('cache-control');
  if (cacheControl != null) {
    cacheControlMaxAge = Number(cacheControl.split('=')[1]);
  }
  let wxResponseJson: [Weather] | null = null;
  try {
    wxResponseJson = await wxResponse.json();
  } catch (error) {
    console.error(`fetchWeather: failed to extract JSON from response body - ${error}`);
  }
  if (wxResponseJson != null) {
    localStorage.setItem('lastWeatherReport', JSON.stringify(wxResponseJson));
    localStorage.setItem('lastWxCacheControlMaxAge', String(cacheControlMaxAge));
  } else {
    localStorage.setItem('lastWxCacheControlMaxAge', '0');
  }
  return wxResponseJson;
};

const getWeather = async () => {
  // Get last expiration time to see if we should show the last weather report or nothing if the request fails.
  const previousWeatherText = localStorage.getItem('lastWeatherReport');
  const previousWeather: [Weather] | null = previousWeatherText == null ? null : JSON.parse(previousWeatherText);
  const previousObservationExpiratonTime = previousWeather?.[0]?.['v3-wx-observations-current'].expirationTimeUtc;
  let previousObservationExpiraton: dayjs.Dayjs | null = null;
  if (previousObservationExpiratonTime != null) {
    previousObservationExpiraton = dayjs.unix(previousObservationExpiratonTime);
  }
  let lastWeatherIsValid = false;
  if (previousObservationExpiraton != null) {
    const lastWxCacheControlMaxAge = Number(localStorage.getItem('lastWxCacheControlMaxAge'));
    lastWeatherIsValid = previousObservationExpiraton.add(lastWxCacheControlMaxAge, 's').isAfter(dayjs());
  }

  const currentWeather = await fetchWeather();

  if (currentWeather != null) {
    return currentWeather[0];
  }

  if (lastWeatherIsValid) {
    return previousWeather != null ? previousWeather[0] : null;
  }

  return null;
};

const writeWeather = (wx: Weather | null | undefined) => {
  if (wx != null) {
    // Write weather values
    const currentTemp = wx['v3-wx-observations-current'].temperature;
    const readoutElement = window.document.getElementById('wx-current-temp-readout');
    if (readoutElement) {
      readoutElement.innerHTML = `${currentTemp}&deg;`;
    }

    const feelsLike = wx['v3-wx-observations-current'].temperatureFeelsLike;
    const feelsLikeElement = window.document.getElementById('wx-current-temp-feelslike');
    if (feelsLikeElement) {
      feelsLikeElement.innerHTML = `<span class="paren">(</span>${feelsLike}&deg;<span class="paren">)</span>`;
    }

    const currentIconNumber = wx['v3-wx-observations-current'].iconCode;
    const currentIcon = icons[currentIconNumber];
    const currentIconElement = window.document.getElementById('wx-current-icon');
    if (currentIconElement) {
      currentIconElement.innerHTML = `<img src="${currentIcon}" />`;
    }

    const currentDescription = wx['v3-wx-observations-current'].wxPhraseMedium;
    const currentDescriptionElement = window.document.getElementById('wx-current-description');
    if (currentDescriptionElement) {
      currentDescriptionElement.innerHTML = currentDescription;
    }

    const daypart = wx['v3-wx-forecast-daily-10day'].daypart[0];
    // eslint-disable-next-line no-magic-numbers
    const forecastDaypartIndices = daypart.temperature[0] == null ? [1, 2, 3] : [0, 1, 2];
    const forecastHtml = forecastDaypartIndices.map((index) => {
      const daypartName = daypart.daypartName[index];
      const temperature = daypart.temperature[index];
      const iconCode = daypart.iconCode[index];
      const wxPhraseShort = daypart.wxPhraseShort[index];
      const snowRange = daypart.snowRange[index];
      const tempPhrase = daypart.dayOrNight[index] === 'D' ? 'High' : 'Low';

      const snowHtml = ` <span class="wx-forecast-snow">${snowRange}</span>`;
      return `
      <div class="wx-forecast-day">
        <div class="wx-forecast-name">${daypartName === 'Tomorrow night' ? 'Tom. night' : daypartName}</div>
        <div class="wx-forecast-icon"><img src="${icons[iconCode]}" /></div>
        <div class="wx-forecast-phrase">${wxPhraseShort} </div>
        <div class="wx-forecast-temp">${tempPhrase} ${temperature}&deg;${snowRange !== '' ? snowHtml : ''}</div>
      </div>
      `;
    });

    forecastHtml.forEach((forecast, index) => {
      const forecastDayElement = document.getElementById(`wx-forecast-${index}`);
      if (forecastDayElement != null) {
        forecastDayElement.innerHTML = forecast;
      }
    });
  } else {
    // Write null weather
  }
};

const fetchAndWriteWeather = async () => {
  const wx = await getWeather();
  writeWeather(wx);
};

export const weather = async () => {
  await fetchAndWriteWeather();
  const minutes = 15;
  const delayMs = dayjs.duration({ minutes }).asMilliseconds();
  setInterval(fetchAndWriteWeather, delayMs);
};
