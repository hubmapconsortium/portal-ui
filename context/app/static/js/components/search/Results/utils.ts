import { get } from 'js/helpers/nodash';
import { Entity } from 'js/components/types';

const donorMetadataPath = 'mapped_metadata';
const sampleMetadataPath = 'metadata';

const paths = {
  donor: {
    donor: donorMetadataPath,
  },
  sample: {
    sample: sampleMetadataPath,
    donor: `donor.${donorMetadataPath}`,
  },
  dataset: {
    donor: `donor.${donorMetadataPath}`,
    sample: `source_samples.${sampleMetadataPath}`,
    dataset: 'metadata',
  },
};

const samplePaths = ['origin_samples.', 'source_samples.'];

function matchSamplePath(fieldIdentifier: string) {
  return samplePaths.reduce((matchedPath, path) => {
    if (fieldIdentifier.startsWith(path)) {
      return path;
    }
    return matchedPath;
  }, '');
}

// TODO: Return type should be a union of Entity leaf types.
function getFieldFromHitFields(hitFields: Partial<Entity>, identifier: string) {
  const matchedSamplePath = matchSamplePath(identifier);
  if (matchedSamplePath.length > 0) {
    // source_samples and origin_samples are arrays and must be handled accordingly.
    // TODO: Update design to reflect samples and datasets which have multiple origin samples with different organs.
    return get(hitFields, [matchedSamplePath, '0', ...identifier.split('.').slice(1)].join('.'), '');
  }

  return get(hitFields, identifier, '');
}

function getByPath(hitSource: Partial<Entity>, field: string) {
  const fieldValue = getFieldFromHitFields(hitSource, field);

  if (Array.isArray(fieldValue)) {
    return fieldValue.join(' / ');
  }

  return fieldValue;
}

export { getByPath, getFieldFromHitFields, paths };
