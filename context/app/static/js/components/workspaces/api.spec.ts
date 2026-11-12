import { apiUrls } from './api';

const endpoint = 'https://ws.example';

// The workspaces API only routes paths with a trailing slash, and on DEV the gateway no longer adds it.
// This walks every key, so a new getter or URL function is checked without being listed here.
test('every workspaces API URL path ends in a slash', () => {
  const urls = apiUrls(endpoint);
  const built = Object.keys(urls).map((key) => {
    const value: unknown = urls[key as keyof typeof urls];
    return typeof value === 'function' ? String((value as (arg: number) => string)(1)) : String(value);
  });
  // Skip portal-relative paths such as createWorkspaceFromNotebookPath; they don't call the workspaces API.
  const endpointOrigin = new URL(endpoint).origin;
  const apiCalls = built.filter((url) => {
    const parsed = new URL(url, endpoint);
    return /^https?:$/.test(parsed.protocol) && parsed.origin === endpointOrigin;
  });

  expect(apiCalls.length).toBeGreaterThan(0);
  apiCalls.forEach((url) => expect(new URL(url).pathname).toMatch(/\/$/));
});
