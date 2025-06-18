export function isError(response: object): response is Error {
  return 'message' in response;
}
