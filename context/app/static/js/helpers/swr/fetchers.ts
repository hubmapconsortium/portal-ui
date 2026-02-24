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
  urls: (string | null)[];
  requestInits?: RequestInit[];
  returnPartialResults?: boolean;
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
      return f({ url: s3URL, expectedStatusCodes, errorMessages, returnResponse });
    }
    if (!expectedStatusCodes.includes(response.status)) {
      const rawText = await response.text();
      let errorBody: Record<string, unknown> = { error: rawText };
      try {
        errorBody = JSON.parse(rawText) as Record<string, unknown>;
      } catch {
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
    return response.json() as Promise<unknown>;
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
 * @param fetchOptions.returnPartialResults - If true, will return results for successful fetches even if some fetches fail
 */

export async function multiFetcher<T>({
  urls,
  requestInits = [{}],
  expectedStatusCodes = [200],
  errorMessages = {},
  returnResponse = false,
  returnPartialResults = false,
}: MultiFetchOptionsType) {
  if (urls.length === 0) {
    return Promise.resolve([] as T[]);
  }

  const filteredData = urls.reduce<{ urls: string[]; requestInits: RequestInit[] }>(
    (acc, url, i) => {
      if (url) {
        acc.urls.push(url);
        acc.requestInits.push(requestInits.length === 1 ? requestInits[0] : requestInits[i]);
      }
      return acc;
    },
    { urls: [], requestInits: [] },
  );

  const filteredUrls = filteredData.urls;
  const filteredRequestInits = filteredData.requestInits;

  const promiseList = filteredUrls.map((url, i) =>
    f({
      url,
      requestInit: filteredRequestInits.length === 1 ? filteredRequestInits[0] : filteredRequestInits[i],
      expectedStatusCodes,
      errorMessages,
      returnResponse,
    }),
  );

  if (returnPartialResults) {
    const results = await Promise.allSettled(promiseList);
    return results
      .filter((result): result is PromiseFulfilledResult<unknown> => result.status === 'fulfilled')
      .map((result) => result.value) as T[];
  }

  return Promise.all(promiseList) as Promise<T[]>;
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
