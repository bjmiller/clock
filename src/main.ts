import './main.less';
import './time.less';
import './weather.less';
import './sports.less';
import { time } from './time';
import { weather } from './weather';
import { sports } from './sports';

document.addEventListener('DOMContentLoaded', () => {
  time();
  weather();
  sports();
});
