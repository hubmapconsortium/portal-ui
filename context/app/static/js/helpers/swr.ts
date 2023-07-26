type fetchOptionsType = {
  urls: string;
  requestInit: RequestInit;
  expectedStatusCodes: number[];
};

/**
 * SWR fetcher which accepts an array of URLs and returns the responses as JSON
 * A custom requestInit object can be passed to fetch as well.
 * @example // without requestInit
 * const { data } = useSWR({ urls, multiFetcher });
 * @example // with requestInit
 * const { data } = useSWR({ urls, token }, ({ urls, token }) => multiFetcher({ urls, { headers: { Authorization: `Bearer ${token}` } } })
 * @param fetchOptions
 * @param fetchOptions.urls - Array of URLs to fetch
 * @param fetchOptions.requestInit - Optional RequestInit object to pass to fetch
 * @param fetchOptions.expectedStatusCodes - Optional array of status codes which reflect a succesful request
 */

export async function multiFetcher<T>({ urls, requestInit = {}, expectedStatusCodes = [200] }: fetchOptionsType) {
  const f = (url: string) =>
    fetch(url, requestInit).then((response) => {
      if (!expectedStatusCodes.includes(response.status)) {
        const error = new Error(`The request to ${urls.join(', ')} failed.`);
        error.info = response.json();
        error.status = response.status;
        throw error;
      }
      return response.json();
    });

  if (urls.length === 0) {
    return Promise.resolve([] as T[]);
  }
  return Promise.all(urls.map((url) => f(url))) as Promise<T[]>;
}

/**
 * SWR fetcher which accepts a single URL and returns the response as JSON.
 * A custom requestInit object can be passed to fetch as well.
 * @example // without requestInit
 * const { data } = useSWR({ urls, multiFetcher });
 * @example // with requestInit
 * const { data } = useSWR({ urls, token }, ({ urls, token }) => multiFetcher({ urls, { headers: { Authorization: `Bearer ${token}` } } })
 * @param fetchOptions
 * @param fetchOptions.urls - Array of URLs to fetch
 * @param fetchOptions.requestInit - Optional RequestInit object to pass to fetch
 * @param fetchOptions.expectedStatusCodes - Optional array of status codes which reflect a succesful request
 */
export async function fetcher<T>({ url, requestInit = {}, expectedStatusCodes = [200] }: fetchOptionsType) {
  return multiFetcher({ urls: [url], requestInit, expectedStatusCodes }).then((data) => data[0]) as Promise<T>;
}
