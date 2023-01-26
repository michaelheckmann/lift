// https://usehooks-ts.com/react-hook/use-countdown
import { useCallback } from "react";

import useBoolean from "./useBoolean";
import useCounter from "./useCounter";
import useInterval from "./useInterval";

interface CountdownOption {
  countStart: number;
  intervalMs?: number;
  isIncrement?: boolean;
  countStop?: number;
}
interface CountdownControllers {
  startCountdown: () => void;
  stopCountdown: () => void;
  resetCountdown: () => void;
  incrementCountdown: (n: number) => void;
  decrementCountdown: (n: number) => void;
}

/**
 * New interface with default value
 *
 * @param  {CountdownOption} countdownOption
 * @param  {number} countdownOption.countStart - the countdown's starting number, initial value of the returned number.
 * @param  {?number} countdownOption.countStop -  `0` by default, the countdown's stopping number. Pass `-Infinity` to decrease forever.
 * @param  {?number} countdownOption.intervalMs - `1000` by default, the countdown's interval, in milliseconds.
 * @param  {?boolean} countdownOption.isIncrement - `false` by default, true if the countdown is increment.
 * @returns [counter, CountdownControllers]
 */
function useCountdown(
  countdownOption: CountdownOption
): [number, CountdownControllers];

function useCountdown(
  countdownOption: CountdownOption
): [number, CountdownControllers] {
  let countStart,
    intervalMs,
    isIncrement: boolean | undefined,
    countStop: number | undefined;

  ({ countStart, intervalMs, isIncrement, countStop } = countdownOption);

  // default values
  intervalMs = intervalMs ?? 1000;
  isIncrement = isIncrement ?? false;
  countStop = countStop ?? 0;

  const {
    count,
    increment,
    decrement,
    reset: resetCounter,
    setCount,
  } = useCounter(countStart);

  /**
   * Note: used to control the useInterval
   * running: If true, the interval is running
   * start: Should set running true to trigger interval
   * stop: Should set running false to remove interval
   */
  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown,
  } = useBoolean(false);

  /**
   * Will set running false and reset the seconds to initial value
   */
  const resetCountdown = () => {
    stopCountdown();
    resetCounter();
  };

  const countdownCallback = useCallback(() => {
    if (count === countStop) {
      stopCountdown();
      return;
    }

    if (isIncrement) {
      increment();
    } else {
      decrement();
    }
  }, [count, countStop, decrement, increment, isIncrement, stopCountdown]);

  // Custom addition
  const incrementCountdown = (interval: number) => {
    if (!isCountdownRunning) startCountdown();
    setCount((count) => count + interval);
  };

  // Custom addition
  const decrementCountdown = (interval: number) => {
    if (count - interval < countStop) return resetCountdown();
    if (!isCountdownRunning) startCountdown();
    setCount((count) => count - interval);
  };

  useInterval(countdownCallback, isCountdownRunning ? intervalMs : null);

  return [
    count,
    {
      startCountdown,
      stopCountdown,
      resetCountdown,
      incrementCountdown,
      decrementCountdown,
    } as CountdownControllers,
  ];
}

export default useCountdown;
