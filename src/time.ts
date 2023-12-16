import dayjs from 'dayjs';

const delayMs = 1000;

export const time = () => {
  setInterval(() => {
    const now = new Date();
    const currentTime = dayjs(now).format('h:mm');
    const period = dayjs(now).format('a');
    const timespan = window.document.getElementById('current-time');
    const periodspan = window.document.getElementById('dayperiod');
    if (timespan && timespan.innerHTML !== currentTime) {
      timespan.innerHTML = currentTime;
    }
    if (periodspan && periodspan.innerHTML !== period) {
      periodspan.innerHTML = period;
    }
  }, delayMs);
};
