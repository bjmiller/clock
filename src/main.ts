import dayjs from 'dayjs';
import './main.less';

const delayMs = 1000;

setInterval(() => {
  const now = new Date();
  const time = dayjs(now).format('h:mm');
  const period = dayjs(now).format('a');
  const timespan = window.document.getElementById('time');
  const periodspan = window.document.getElementById('dayperiod');
  if (timespan && timespan.innerHTML !== time) {
    timespan.innerHTML = time;
  }
  if (periodspan && periodspan.innerHTML !== period) {
    periodspan.innerHTML = period;
  }
}, delayMs);

setTimeout(() => {
  const msg = document.getElementById('message');
  if (msg != null) {
    msg.innerHTML = '';
  }
  // eslint-disable-next-line no-magic-numbers
}, 5000);
