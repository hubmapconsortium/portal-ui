import { Entity } from 'js/components/types';
import { ProcessedDatasetInfo } from './hooks';

export function datasetSectionId(dataset: Pick<ProcessedDatasetInfo, 'hubmap_id'>, prefix = '') {
  return `${prefix}-${encodeURIComponent(dataset.hubmap_id)}`.toLowerCase();
}

export function processDatasetLabel(
  dataset: Pick<ProcessedDatasetInfo, 'assay_display_name' | 'pipeline' | 'status' | 'hubmap_id'>,
  hits: { _source: Pick<ProcessedDatasetInfo, 'assay_display_name' | 'pipeline' | 'status'> }[],
) {
  const label = dataset.pipeline ?? dataset.assay_display_name[0];
  const hasMultipleHitsWithSameLabel =
    hits.filter((h) => (h._source.pipeline ?? h._source.assay_display_name[0]) === label).length > 1;

  const hasMultipleHitsWithSameLabelAndStatus =
    hasMultipleHitsWithSameLabel &&
    hits.filter(
      (h) => (h._source.pipeline ?? h._source.assay_display_name[0]) === label && h._source.status === dataset.status,
    ).length > 1;

  if (hasMultipleHitsWithSameLabelAndStatus) {
    return `${label} (${dataset.status}) [${dataset.hubmap_id}]`;
  }
  if (hasMultipleHitsWithSameLabel) {
    return `${label} (${dataset.status})`;
  }

  return label;
}

export function combineContributors(entities: Entity[]) {
  const seenContributorStrings = new Set();
  const combinedContributors = [];
  for (const entity of entities)
    if (entity?.contributors)
      for (const contributor of entity.contributors) {
        const contributorString = `${contributor.first_name}|${contributor.middle_name_or_initial}|${contributor.last_name}|${contributor.affiliation}`;
        if (!seenContributorStrings.has(contributorString)) {
          seenContributorStrings.add(contributorString);
          combinedContributors.push(contributor);
        }
      }
  return combinedContributors;
}
