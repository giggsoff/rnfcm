import moment from 'moment';
export const TIMER_TICK = (tick) => ({
  type: 'TIMER_TICK',
  tick
});
export const TIMER_STOP = () => ({
  type: 'TIMER_STOP',
});
export const TIMER_START = () => ({
  type: 'TIMER_START',
});
let timer = null;
const tick = (num) => {
  return TIMER_TICK(num);
};
export const startBackgroundTimer = () => (dispatch) => {
  clearInterval(timer);
  timer = setInterval(() => dispatch(tick(moment())), 5000);
  dispatch(TIMER_START());
};
export const stopBackgroundTimer = () => {
  clearInterval(timer);
  return TIMER_STOP();
};
