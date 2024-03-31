import dayjs from 'dayjs';

const delayMs = 1000;

const writeTime = () => {
  const now = dayjs();
  const currentTime = now.format('h:mm');
  const period = now.format('a');
  const timespan = window.document.getElementById('time-current');
  const periodspan = window.document.getElementById('time-dayperiod');
  if (timespan && timespan.innerHTML !== currentTime) {
    timespan.innerHTML = currentTime;
  }
  if (periodspan && periodspan.innerHTML !== period) {
    periodspan.innerHTML = period;
    periodspan.className = period;
  }
};

export const time = () => {
  writeTime();
  setInterval(writeTime, delayMs);
};
