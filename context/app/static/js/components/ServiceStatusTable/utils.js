function buildServiceStatus(name, response, noteFunc) {
  const { build, version, api_auth } = response;
  const isUp = api_auth || name === 'gateway';
  // The gateway isn't explicit: If it's not up, you wouldn't get anything at all,
  // (and you wouldn't be able to get to the portal in the first place.)
  return {
    name,
    github: build ? `https://github.com/hubmapconsortium/${name}` : undefined,
    build,
    version,
    isUp,
    note: noteFunc(response),
  };
}

export { buildServiceStatus };
