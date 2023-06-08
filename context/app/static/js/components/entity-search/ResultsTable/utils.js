import get from 'lodash/get';

const samplePaths = ['origin_samples', 'source_samples'];

function matchSamplePath(fieldIdentifier) {
  return samplePaths.reduce((matchedPath, path) => {
    if (fieldIdentifier.startsWith(path)) {
      return path;
    }
    return matchedPath;
  }, '');
}

function getFieldFromHitFields(hitFields, identifier) {
  const matchedSamplePath = matchSamplePath(identifier);
  if (matchedSamplePath.length > 0) {
    // source_samples and origin_samples are arrays and must be handled accordingly.
    return get(hitFields, [matchedSamplePath, '0', identifier.replace(`${matchedSamplePath}.`, '')]);
  }

  return get(hitFields, identifier);
}

export { getFieldFromHitFields };
