import dayjs from 'dayjs';

const delayMs = 1000;

const writeTime = () => {
  const now = dayjs();
  const currentTime = now.format('h:mm');
  const period = now.format('a');
  // eslint-disable-next-line no-magic-numbers
  const pad = Number(now.format('h')) < 10 ? '&nbsp;' : '';
  const timespan = window.document.getElementById('time-current');
  const periodspan = window.document.getElementById('time-dayperiod');
  const dayspan = window.document.getElementById('time-day');
  const datespan = window.document.getElementById('time-date');
  if (timespan && timespan.innerHTML !== currentTime) {
    timespan.innerHTML = `${pad}${currentTime}`;
  }
  if (periodspan && periodspan.innerHTML !== period.slice(0, 1)) {
    periodspan.innerHTML = period.slice(0, 1);
    periodspan.className = period;
  }
  if (dayspan && dayspan.innerHTML !== now.format('ddd')) {
    dayspan.innerHTML = now.format('ddd');
  }
  if (datespan && datespan.innerHTML !== now.format('MMM D')) {
    datespan.innerHTML = now.format('MMM D');
  }
};

export const time = () => {
  writeTime();
  setInterval(writeTime, delayMs);
};
