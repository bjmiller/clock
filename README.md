## The software for Brian's desk clock

This application is intended to run on a Raspberry Pi, and to be displayed on a Waveshare 7.9-inch short rectangular display.

It has three "segments":

- **Time**: This shows the current time.  The motivation behind this project was to have a living room clock that doesn't drift.
- **Weather**: This shows the current weather conditions in my area and short-term weather predictions, provided by Weather Underground.
- **Sports**: This shows today's sports schedules, for teams that I and my family follow.  Currently, this covers baseball and hockey, although more can be added.  There's only room for three entries at the moment, but that's realistically enough for three teams across two sports.


## Stack
This is an Electron application, written in Typescript, in which all of the work is done by the renderer process.  You could say that this whole project's responsibility is to display one dynamic web page. There is no front-end framework used here, only vanilla DOM API calls.  The task is so simple here, that it didn't call for complex tooling.  I use `fetch` out of the box to retrieve information from the internet.  The only external dependency outside of Electron is `dayjs`, because I didn't want to do date-and-time math the hard way.

Webpack is used to tie everything together.  I'm not bothering using a packager to turn the app into a binary, but I am putting all of the necessary code into the minimum number of files - one JavaScript file to bootstrap the main process, and one HTML file to be loaded by the renderer, complete with scripts and styles included, along with images as data URIs.  My "deployment" method is `scp`.

## To build
```shell
$ npm install
$ npm run build
```
This will run webpack in "watch" mode.  You can use Ctrl-C to break out of it at any time once the files are built.
