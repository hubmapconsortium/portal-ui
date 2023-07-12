// Fetcher function that lets SWR fetch multiple urls at once
export const multiFetcher = (...urls: string[]) => {
  const f = (url: string) => fetch(url).then((response) => response.json());
  return Promise.all(urls.map((url) => f(url)));
};
