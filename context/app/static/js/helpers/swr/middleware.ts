import { useRef, useEffect } from 'react';
import { Middleware, SWRHook } from 'swr';

/**
 * Adapted from SWR docs: https://swr.vercel.app/docs/middleware.en-US#keep-previous-result
 * Since those docs were first written, there appear to have been some changes to the SWR API.
 * which break the original implementation of the `isPreviousData` property and `clearPreviousData` function.
 * However, this implementation still keeps the previous data, and it's still useful for our purposes;
 * We can still use the `isLoading` property to determine whether the data is being fetched for the first time,
 * while continuing to use the `data` property to access the previous data.
 * This is a SWR middleware for keeping the data even if key changes.
 * @returns the SWR hook with `data` falling back to displaying the previous returned data when fetching a new key.
 */

const keepPreviousData: Middleware = (useSWRNext: SWRHook) => {
  return (key, fetcher, config) => {
    // Actual SWR hook.
    const swr = useSWRNext(key, fetcher, config);

    // Use a ref to store previous returned data.
    const previousDataRef = useRef<typeof swr.data>();

    useEffect(() => {
      // Update ref if data is not undefined.
      if (swr.data !== undefined) {
        previousDataRef.current = swr.data;
      }
    }, [swr.data]);

    // Fallback to previous data if the current data is undefined.
    const dataOrPreviousData = swr.data === undefined ? previousDataRef.current : swr.data;

    // We must use `Object.assign` to avoid read-only error.
    // eslint-disable-next-line prefer-object-spread
    return Object.assign({}, swr, {
      data: dataOrPreviousData,
    });
  };
};

export { keepPreviousData };

// Augment the SWRResponse interface to include our new properties.
declare module 'swr' {
  // The original SWR interface uses these types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  export interface SWRResponse<Data = any, Error = any> {
    isPreviousData: boolean;
    clearPreviousData: () => void;
  }
}
