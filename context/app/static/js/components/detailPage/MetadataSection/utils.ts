import { TableRows } from 'js/components/detailPage/MetadataSection/MetadataSection';
import { Dataset, Donor, ESEntityType, Sample, isDataset, isSample } from 'js/components/types';
import { getEntityIcon } from 'js/helpers/functions';
import { getMetadata } from 'js/helpers/metadata';
import { ProcessedDatasetInfo } from 'js/pages/Dataset/hooks';
import { MUIIcon } from 'js/shared-styles/icons/entityIconMap';

function buildTableData(
  tableData: Record<string, string | object | unknown[]>,
  metadataFieldDescriptions: Record<string, string> | Record<string, never>,
  extraValues: Record<string, string> = {},
) {
  return (
    Object.entries(tableData)
      // Filter out nested objects, like nested "metadata" for Samples...
      // but allow arrays. Remember, in JS: typeof [] === 'object'
      .filter((entry) => typeof entry[1] !== 'object' || Array.isArray(entry[1]))
      // Filter out fields from TSV that aren't really metadata:
      .filter((entry) => !['contributors_path', 'antibodies_path', 'version'].includes(entry[0]))
      .map((entry) => ({
        ...extraValues,
        key: entry[0],
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        value: Array.isArray(entry[1]) ? entry[1].join(', ') : entry[1].toString(),
        description: metadataFieldDescriptions?.[entry[0]],
      }))
  );
}

export interface TableEntity {
  uuid: string;
  label: string;
  icon: MUIIcon;
  tableRows: TableRows;
  entity_type: ESEntityType;
  hubmap_id: string;
}

interface sortEntitiesProps {
  tableEntities: TableEntity[];
  uuid: string;
}

function sortEntities({ tableEntities, uuid }: sortEntitiesProps) {
  return [...tableEntities].sort((a, b) => {
    // Current entity at the front
    if (a.uuid === uuid) return -1;
    if (b.uuid === uuid) return 1;

    // Then donors
    if (a.entity_type === 'Donor' && b.entity_type !== 'Donor') return -1;
    if (b.entity_type === 'Donor' && a.entity_type !== 'Donor') return 1;

    // Then samples, with unique categories first
    const aIsSampleWithoutHubmapId = a.entity_type === 'Sample' && !a.label.includes(a.hubmap_id);
    const bIsSampleWithoutHubmapId = b.entity_type === 'Sample' && !b.label.includes(b.hubmap_id);
    if (aIsSampleWithoutHubmapId && !bIsSampleWithoutHubmapId) return -1;
    if (bIsSampleWithoutHubmapId && !aIsSampleWithoutHubmapId) return 1;

    return a.label.localeCompare(b.label);
  });
}

interface getEntityLabelProps {
  entity: ProcessedDatasetInfo | Donor | Sample;
  sampleCategoryCounts: Record<string, number>;
}

function getEntityLabel({ entity, sampleCategoryCounts }: getEntityLabelProps) {
  if (isSample(entity)) {
    // If samples have the same category, add the HuBMAP ID to the label
    if (sampleCategoryCounts[entity.sample_category] > 1) {
      return `${entity.sample_category} (${entity.hubmap_id})`;
    }
    return entity.sample_category;
  }
  if (isDataset(entity)) {
    return entity.assay_display_name[0];
  }
  return entity.entity_type;
}

interface getTableEntitiesProps {
  entities: (Donor | Dataset | Sample)[];
  uuid: string;
  fieldDescriptions: Record<string, string>;
}

function getTableEntities({ entities, uuid, fieldDescriptions }: getTableEntitiesProps) {
  // Keep track of whether there are multiple samples with the same category
  const sampleCategoryCounts: Record<string, number> = {};
  entities.forEach((e) => {
    if (isSample(e)) {
      sampleCategoryCounts[e.sample_category] = (sampleCategoryCounts[e.sample_category] || 0) + 1;
    }
  });

  const tableEntities = entities.map((entity) => {
    // Generate a label with the HuBMAP ID if there are multiple samples with the same category
    const label = getEntityLabel({ entity, sampleCategoryCounts });
    return {
      uuid: entity.uuid,
      label: label ?? '',
      icon: getEntityIcon(entity),
      tableRows: buildTableData(
        getMetadata({
          targetEntityType: entity.entity_type,
          currentEntity: entity,
        }),
        fieldDescriptions,
        { hubmap_id: entity.hubmap_id, label },
      ),
      entity_type: entity.entity_type,
      hubmap_id: entity.hubmap_id,
    };
  });

  return sortEntities({ tableEntities, uuid });
}

export { getTableEntities, buildTableData, sortEntities };
