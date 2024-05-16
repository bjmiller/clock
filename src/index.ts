import { app, BrowserWindow } from 'electron';
import { watch, WatchListener } from 'node:original-fs';

const width = 1280;
const height = 400;

const createWindow = () => {
  const win = new BrowserWindow({
    width,
    height,
    frame: false
  });

  win.loadFile(`${__dirname}/index.html`);
  return win;
};

app.whenReady().then(() => {
  const win = createWindow();

  const debouncePeriod = 750;
  let reloading = false;
  const listener: WatchListener<string> = () => {
    if (!reloading) {
      reloading = true;
      win.reload();
      setTimeout(() => {
        reloading = false;
      }, debouncePeriod);
    }
  };

  watch('./dist/index.html', listener);
});
