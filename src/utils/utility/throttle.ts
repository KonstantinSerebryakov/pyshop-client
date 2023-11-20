/* eslint-disable @typescript-eslint/no-this-alias */
export function throttle<RET, ARGS extends unknown[]>(
  fn: (...args: ARGS) => RET,
  delay: number
): (...args: ARGS) => RET | undefined {
  let isThrottling = false;
  let savedArgs: ARGS | null;
  let savedThis: unknown | null;

  return function wrapper(this: unknown, ...args: ARGS): RET | undefined {
    if (isThrottling) {
      savedArgs = args;
      savedThis = this;
      return;
    }
    isThrottling = true;

    fn.apply(this, args);

    setTimeout(function () {
      isThrottling = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, delay);
  };
}
