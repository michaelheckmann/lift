/**
 * It returns a function that, when called, will call the original function after a timeout, unless the
 * timeout is reset by calling the returned function again.
 * @param func - the function to be debounced
 * @param [timeout=300] - The time in milliseconds to wait before calling the function.
 */
export function debounce(func, timeout = 300) {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
