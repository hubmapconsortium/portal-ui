/**
 * SWR fetcher which accepts an array of URLs and returns the responses as JSON
 * A custom requestInit object can be passed to fetch as well.
 * @example // without requestInit
 * const { data } = useSWR(urls, multiFetcher);
 * @example // with requestInit
 * const { data } = useSWR({ urls, token }, ({ urls, token }) => multiFetcher(urls, { headers: { Authorization: `Bearer ${token}` } })
 * @param urls - Array of URLs to fetch
 * @param requestInit - Optional RequestInit object to pass to fetch
 */

export async function multiFetcher<T>(urls: string[], requestInit: RequestInit = {}) {
  const f = (url: string) => fetch(url, requestInit).then((response) => response.json());
  if (urls.length === 0) {
    return Promise.resolve([] as T[]);
  }
  return Promise.all(urls.map((url) => f(url))) as Promise<T[]>;
}

/**
 * SWR fetcher which accepts a single URL and returns the response as JSON.
 * A custom requestInit object can be passed to fetch as well.
 * @example // without requestInit
 * const { data } = useSWR(urls, multiFetcher);
 * @example // with requestInit
 * const { data } = useSWR({ urls, token }, ({ urls, token }) => multiFetcher(urls, { headers: { Authorization: `Bearer ${token}` } })
 * @param urls - Array of URLs to fetch
 * @param requestInit - Optional RequestInit object to pass to fetch
 */
export async function fetcher<T>(url: string, requestInit: RequestInit = {}) {
  return multiFetcher([url], requestInit).then((data) => data[0]) as Promise<T>;
}
