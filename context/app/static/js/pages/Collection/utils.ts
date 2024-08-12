export function getCollectionDOI(doi_url: string) {
  return new URL(doi_url).pathname.slice(1);
}
