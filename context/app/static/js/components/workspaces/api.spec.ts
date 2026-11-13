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
  // Portal-relative paths, such as createWorkspaceFromNotebookPath, don't call the workspaces API.
  // Resolving them against a different origin makes the origin check skip them.
  const apiCalls = built.filter((url) => new URL(url, 'https://portal.example').origin === endpoint);

  expect(apiCalls.length).toBeGreaterThan(0);
  apiCalls.forEach((url) => expect(new URL(url).pathname).toMatch(/\/$/));
});
