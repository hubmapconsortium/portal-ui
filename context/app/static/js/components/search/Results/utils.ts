import { get } from 'js/helpers/nodash';
import { HitDoc, HitValues } from '../types';

const donorMetadataPath = 'mapped_metadata';
const sampleMetdataPath = 'metadata';

const paths = {
  donor: {
    donor: donorMetadataPath,
  },
  sample: {
    sample: sampleMetdataPath,
    donor: `donor.${donorMetadataPath}`,
  },
  dataset: {
    donor: `donor.${donorMetadataPath}`,
    sample: `source_samples.${sampleMetdataPath}`,
    dataset: 'metadata.metadata',
  },
};

const samplePaths = ['origin_samples', 'source_samples'];

function matchSamplePath(fieldIdentifier: string) {
  return samplePaths.reduce((matchedPath, path) => {
    if (fieldIdentifier.startsWith(path)) {
      return path;
    }
    return matchedPath;
  }, '');
}

function getFieldFromHitFields(hitFields: HitDoc, identifier: string): HitValues {
  const matchedSamplePath = matchSamplePath(identifier);
  if (matchedSamplePath.length > 0) {
    // source_samples and origin_samples are arrays and must be handled accordingly.
    // TODO: Update design to reflect samples and datasets which have multiple origin samples with different organs.
    return get(hitFields, [matchedSamplePath, '0', ...identifier.split('.').slice(1)].join('.'));
  }

  return get(hitFields, identifier);
}

function getByPath(hitSource: HitDoc, field: string) {
  const fieldValue = getFieldFromHitFields(hitSource, field);

  if (Array.isArray(fieldValue)) {
    return fieldValue.join(' / ');
  }

  return fieldValue;
}

export { getByPath, getFieldFromHitFields, paths };
