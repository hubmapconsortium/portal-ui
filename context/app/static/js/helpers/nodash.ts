// This file contains functions that replace lodash functions to trim down the size of the bundle
// and to avoid importing the entire lodash library.

// The function descriptions are sourced from the lodash type definitions: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/lodash/

/**
 * Gets the property value at path of object. If the resolved value is undefined the defaultValue is used
 * in its place.
 *
 * Implementation sourced from https://you-dont-need.github.io/You-Dont-Need-Lodash-Underscore/#/?id=_get
 * and adapted to TypeScript.
 *
 * @param obj The object to query.
 * @param path The path of the property to get.
 * @param defaultValue The value returned if the resolved value is undefined.
 * @return Returns the resolved value, typecast to the appropriate type.
 */
export function get<T, TObj extends object, TPath extends string>(obj: TObj, path: TPath, defaultValue?: T): T {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key as keyof typeof res] : res) as TObj, obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return (result === undefined || result === obj ? defaultValue : result) as T;
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since
 * the last time the debounced function was invoked.
 *
 * Adapted from https://stackoverflow.com/questions/72205837/safe-type-debounce-function-in-typescript.
 *
 * The original implementation had a different argument order and did not follow our style guide.
 *
 * @param callback The function to debounce.
 * @param wait The number of milliseconds to delay.
 * @param immediate Specify invoking on the leading edge of the timeout.
 * @return Returns the new debounced function.
 */
export function debounce<T extends (...args: unknown[]) => void>(callback: T, wait: number, immediate = false) {
  // This is a number in the browser and an object in Node.js,
  // so we'll use the ReturnType utility to cover both cases.
  let timeout: ReturnType<typeof setTimeout> | null;

  return (...args: Parameters<typeof callback>) => {
    // Creates the function that'll be called after a delay.
    const later = () => {
      timeout = null;

      if (!immediate) {
        callback(...args);
      }
    };

    // If the `immediate` arg is passed to debounce and there is no current timeout,
    // call the function immediately as well.
    const callNow = immediate && !timeout;

    if (typeof timeout === 'number') {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      callback(...args);
    }
  };
}
