// Fetcher function that lets SWR fetch multiple urls at once
export const multiFetcher = (...urls: string[]) => {
  const f = (url: string) => fetch(url).then((response) => response.json());
  if (urls.length === 0) {
    return Promise.resolve([]);
  }
  return Promise.all(urls.map((url) => f(url)));
};

export const multiFetcherWithToken = (token: string, ...urls: string[]) => {
  const f = (url: string) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => response.json());
  if (urls.length === 0) {
    return Promise.resolve([]);
  }
  return Promise.all(urls.map((url) => f(url)));
};
