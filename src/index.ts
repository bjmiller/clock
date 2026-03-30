import { app, BrowserWindow } from 'electron';
import { watchFile, type StatsListener } from 'node:original-fs';
import * as os from 'node:os';
import Rollbar from 'rollbar';

let rollbar: Rollbar;
try {
  rollbar = Rollbar.init({
    accessToken: process.env.ROLLBAR_SERVER_KEY,
    environment: os.release().includes('rpi') ? 'production' : 'development',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      context: {
        addErrorContext: true,
        autoInstrument: {
          log: true
        }
      }
    }
  });
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('Main process: Error initializing Rollbar', e);
}

const width = 1280;
const height = 400;

const createWindow = () => {
  const win = new BrowserWindow({
    width,
    height,
    fullscreen: os.release().includes('rpi') ? true : false,
    frame: false
  });

  void win.loadFile(`${__dirname}/index.html`);
  win.focus();
  return win;
};

void app.whenReady().then(() => {
  const win = createWindow();

  const debouncePeriod = 750;
  let reloading = false;
  const listener: StatsListener = () => {
    if (!reloading) {
      reloading = true;
      win.reload();
      setTimeout(() => {
        reloading = false;
      }, debouncePeriod);
    }
  };

  watchFile('./dist/index.html', listener);

  win.webContents.on('render-process-gone', () => {
    app.relaunch();
    app.quit();
  });

  process.on('SIGUSR2', () => win.reload());

  rollbar.info('Main process started');
});
