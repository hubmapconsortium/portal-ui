import { SWRError } from './errors';

export interface FetchOptionsType {
  expectedStatusCodes?: number[];
  errorMessages?: Record<number, string>;
  returnResponse?: boolean;
}

export type SingleFetchOptionsType = FetchOptionsType & {
  requestInit?: RequestInit;
  url: string;
};

export type MultiFetchOptionsType = FetchOptionsType & {
  urls: string[];
  requestInits?: RequestInit[];
};

async function f({
  url,
  requestInit = {},
  expectedStatusCodes = [200],
  errorMessages = {},
  returnResponse = false,
}: SingleFetchOptionsType): Promise<unknown> {
  return fetch(url, requestInit).then(async (response) => {
    // Separate handling for 303 status code thrown by ES when documents are >10MB
    if (response.status === 303) {
      const s3URL = await response.text();
      return fetch(s3URL);
    }
    if (!expectedStatusCodes.includes(response.status)) {
      const rawText = await response.text();
      let errorBody: Record<string, unknown> = { error: rawText };
      try {
        errorBody = JSON.parse(rawText) as Record<string, unknown>;
      } catch (e) {
        // Ignore and use the raw text instead since error was not returned as json
      }
      const message = errorMessages[response.status] ?? `The request to ${url} failed.`;
      const error = new SWRError(message, {
        info: errorBody,
        status: response.status,
        url,
      });
      throw error;
    }
    if (returnResponse) {
      return response;
    }
    return response.json();
  });
}

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
 * @param fetchOptions.errorMessages - Optional map of error messages to display for each URL
 */

export async function multiFetcher<T>({
  urls,
  requestInits = [{}],
  expectedStatusCodes = [200],
  errorMessages = {},
  returnResponse = false,
}: MultiFetchOptionsType) {
  if (urls.length === 0) {
    return Promise.resolve([] as T[]);
  }
  return Promise.all(
    urls.map((url, i) =>
      f({
        url,
        requestInit: requestInits.length === 1 ? requestInits[0] : requestInits[i],
        expectedStatusCodes,
        errorMessages,
        returnResponse,
      }),
    ),
  ) as Promise<T[]>;
}

/**
 * SWR fetcher which accepts a single URL and returns the response as JSON.
 * A custom requestInit object can be passed to fetch as well.
 * @example // without requestInit
 * const { data } = useSWR({ urls, fetcher });
 * @example // with requestInit
 * const { data } = useSWR({ urls, token }, ({ urls, token }) => multiFetcher({ urls, { headers: { Authorization: `Bearer ${token}` } } })
 * @param fetchOptions
 * @param fetchOptions.url - URL to fetch
 * @param fetchOptions.requestInit - Optional RequestInit object to pass to fetch
 * @param fetchOptions.expectedStatusCodes - Optional array of status codes which reflect a succesful request
 * @param fetchOptions.errorMessages - Optional map of error messages to display for each URL
 */
export async function fetcher<T>({
  url,
  requestInit = {},
  expectedStatusCodes = [200],
  errorMessages = {},
  returnResponse = false,
}: SingleFetchOptionsType) {
  return multiFetcher({
    urls: [url],
    requestInits: [requestInit],
    expectedStatusCodes,
    errorMessages,
    returnResponse,
  }).then((data) => data[0]) as Promise<T>;
}
