import { HierarchicalTermValues, buildSearchLink } from '../search/store';

interface SearchURLTypes {
  entityType: 'Donor' | 'Dataset' | 'Sample';
  organTerms: string[];
  assay?: string;
  mappedAssay?: string;
  assayTypeMap?: Record<string, string[]>;
  donorRace?: string;
  donorSex?: string;
  analyteClass?: string;
  processingStatus?: string;
}

function getAssayFilterLink({
  assay,
  mappedAssay,
  assayTypeMap,
}: Pick<SearchURLTypes, 'assay' | 'mappedAssay' | 'assayTypeMap'>):
  | { raw_dataset_type: HierarchicalTermValues<string[]> }
  | Record<string, never> {
  if (!assayTypeMap || Object.keys(assayTypeMap).length === 0) {
    return {};
  }

  if (assay) {
    const mappedDatasetTypes = assayTypeMap[assay] ?? [];

    return {
      raw_dataset_type: {
        type: 'HIERARCHICAL',
        values: { [assay]: mappedDatasetTypes },
      },
    };
  }

  if (mappedAssay) {
    const parentAssay = Object.keys(assayTypeMap).find((key) => assayTypeMap[key].includes(mappedAssay));

    if (!parentAssay) {
      return {};
    }
    return {
      raw_dataset_type: {
        type: 'HIERARCHICAL',
        values: { [parentAssay]: [mappedAssay] },
      },
    };
  }

  return {};
}

function getSearchURL({
  entityType,
  organTerms,
  assay,
  mappedAssay,
  assayTypeMap,
  donorRace,
  donorSex,
  analyteClass,
  processingStatus,
}: SearchURLTypes) {
  return buildSearchLink({
    entity_type: entityType,
    filters: {
      ...(processingStatus && {
        processing: {
          type: 'TERM',
          values: [processingStatus],
        },
      }),
      ...(organTerms &&
        organTerms.length > 0 && {
          origin_samples_unique_mapped_organs: {
            type: 'TERM',
            values: organTerms,
          },
        }),
      ...(donorRace && {
        'donor.mapped_metadata.race': {
          type: 'TERM',
          values: [donorRace],
        },
      }),
      ...(donorSex && {
        'donor.mapped_metadata.sex': {
          type: 'TERM',
          values: [donorSex],
        },
      }),
      ...(analyteClass && {
        analyte_class: {
          type: 'TERM',
          values: [analyteClass],
        },
      }),
      ...(assayTypeMap &&
        Object.keys(assayTypeMap).length > 0 &&
        getAssayFilterLink({ assay, mappedAssay, assayTypeMap })),
    },
  });
}

export { getSearchURL };
