export function objectIsError(response: object): response is Error {
  return 'message' in response;
}
