import { ProcessedDatasetInfo } from './hooks';
import { ContactAPIResponse, ContributorAPIResponse } from '../../components/detailPage/ContributorsTable/utils';

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

type Person = ContactAPIResponse | ContributorAPIResponse;
interface OrcidPerson {
  orcid: string;
}

export function combinePeopleLists<T extends Person>(peopleLists: T[][]): T[] {
  // Use ORCiD to deduplicate the people if everyone has one; otherwise use name.
  const allHaveOrcid = peopleLists.every(
    (list) => list.every((person) => "orcid" in person)
  );
  const personIdFn = allHaveOrcid
    ? (person: Person) => (person as OrcidPerson).orcid
    : (person: Person) => `${person.first_name}|${person.middle_name_or_initial}|${person.last_name}|${person.affiliation}`;

  // Deduplicate people, keeping track of the sum of the person's index in each list
  // and the total number of lists in which the person appears.
  const seenPersonIds = new Set();
  const personIdxSum: Map<string, number> = new Map();
  const personCount: Map<string, number>  = new Map();
  const combinedPeople: T[] = [];
  for (const list of peopleLists)
    list.forEach((person, i) => {
      const personId = personIdFn(person);
      if (!seenPersonIds.has(personId)) {
        seenPersonIds.add(personId);
        combinedPeople.push(person);
      }
      personIdxSum.set(personId, (personIdxSum.get(personId) || 0) + i);
      personCount.set(personId, (personCount.get(personId) || 0) + 1);
    });

  // Sort the deduplicated list by average index (ascending) and count (descending).
  // In practice, most integrated datasets have the same contributor list for all
  // parent datasets. In these cases, the order will not change.
  combinedPeople.sort((a, b) => {
    const aId = personIdFn(a);
    const bId = personIdFn(b);
    const aCount = personCount.get(aId) || 1;
    const bCount = personCount.get(bId) || 1;
    const aIdxAvg = (personIdxSum.get(aId) || 0) / aCount;
    const bIdxAvg = (personIdxSum.get(bId) || 0) / bCount;
    if (aIdxAvg < bIdxAvg) return -1;
    if (bIdxAvg < aIdxAvg) return 1;
    if (aCount > bCount) return -1;
    if (bCount > aCount) return 1;
    return 0;
  });

  return combinedPeople;
}
