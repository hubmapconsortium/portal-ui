import get from 'lodash/get';

import { paths } from 'js/components/entity-search/SearchWrapper/metadataDocumentPaths';

function getFieldFromHitFields(hitFields, identifier) {
  const datasetSamplePath = paths.dataset.sample;
  if (identifier.startsWith(datasetSamplePath)) {
    // Unlike origin_sample, source_sample is an array and cannot be accessed with lodash/get
    return hitFields?.source_sample?.[0].metadata?.[identifier.replace(`${datasetSamplePath}.`, '')];
  }

  return get(hitFields, identifier);
}

export { getFieldFromHitFields };
