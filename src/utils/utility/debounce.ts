/* eslint-disable @typescript-eslint/no-this-alias */
export function debounce<RET, ARGS extends unknown[]>(
  fn: (...args: ARGS) => RET,
  delay: number
): (...args: ARGS) => RET | undefined {
  let timeout: string | number | NodeJS.Timeout | undefined;
  return function wrapper(this: unknown, ...args: ARGS): RET | undefined {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      return fn.apply(this, args);
    }, delay);
    return undefined;
  };
}
