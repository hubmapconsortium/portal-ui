import React from 'react';
import Stack from '@mui/material/Stack';
import { get } from 'js/helpers/nodash';
import DonorAgeTooltip from 'js/shared-styles/tooltips/DonorAgeTooltip';

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

function getByPath(hitSource, field) {
  const fieldValue = getFieldFromHitFields(hitSource, field.id);

  if ('translations' in field) {
    return field.translations[fieldValue];
  }

  if (Array.isArray(fieldValue)) {
    if (field?.id === 'mapped_metadata.age_value') {
      return (
        <Stack direction="row">
          {fieldValue.join(' / ')}
          <DonorAgeTooltip donorAge={fieldValue.join(' / ')} />
        </Stack>
      );
    }
    return fieldValue.join(' / ');
  }

  return fieldValue;
}

export { getByPath, getFieldFromHitFields, paths };
