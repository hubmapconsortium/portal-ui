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
    // TODO: Update design to reflect samples and datasets which have multiple origin samples with different organs.
    return get(hitFields, [matchedSamplePath, '0', ...identifier.split('.').slice(1)]);
  }

  return get(hitFields, identifier);
}

export { getFieldFromHitFields };
