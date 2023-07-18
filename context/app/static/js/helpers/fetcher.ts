// basic SWR fetcher

export async function fetcher(url: string) {
  return fetch(url).then((response) => response.json());
}

// SWR fetcher with token

export async function fetcherWithToken(token: string, url: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json());
}
