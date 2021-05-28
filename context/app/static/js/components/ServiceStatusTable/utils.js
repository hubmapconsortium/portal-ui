function buildServiceStatus(args) {
  const { apiName, endpointUrl, response, noteFunction } = args;
  const { build, version, api_auth } = response;
  const isUp = api_auth || apiName === 'gateway';
  // The gateway isn't explicit: If it's not up, you wouldn't get anything at all,
  // (and you wouldn't be able to get to the portal in the first place.)
  return {
    apiName,
    endpointUrl,
    github: build ? `https://github.com/hubmapconsortium/${apiName}` : undefined,
    build,
    version,
    isUp,
    note: noteFunction(response),
  };
}

export { buildServiceStatus };
