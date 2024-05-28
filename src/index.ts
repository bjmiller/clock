import { app, BrowserWindow } from 'electron';
import { watchFile, StatsListener } from 'node:original-fs';

const width = 1280;
const height = 400;

const createWindow = () => {
  const win = new BrowserWindow({
    width,
    height,
    fullscreen: true,
    frame: false
  });

  win.loadFile(`${__dirname}/index.html`);
  win.focus();
  return win;
};

app.whenReady().then(() => {
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
});
