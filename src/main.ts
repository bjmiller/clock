import './main.less';
import './time.less';
import './weather.less';
import './sports.less';
import { time } from './time';
import { weather } from './weather';
import { sports } from './sports';
import Rollbar from 'rollbar';

declare global {
  interface Window {
    Rollbar: Rollbar;
    BUILD_TIME: string;
  }
}

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_CLIENT_KEY,
  environment: 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    context: {
      addErrorContext: true,
      autoInstrument: {
        log: true,
        dom: true,
        network: true,
        connectivity: true,
        networkRequestBody: true,
        networkResponseBody: true
      }
    }
  },
  transform: (payload) => {
    const storageItems: Record<string, string | null> = {};
    Object.keys(localStorage).forEach((key) => {
      const value = localStorage.getItem(key);
      storageItems[key] = value;
    });

    payload.custom = { storage: storageItems };
  }
});

window.Rollbar = rollbar;

document.addEventListener('DOMContentLoaded', () => {
  time();
  void weather();
  void sports();
});
