import React, { PropsWithChildren } from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { tableToDelimitedString, createDownloadUrl } from 'js/helpers/functions';
import { useMetadataFieldDescriptions } from 'js/hooks/useUBKG';
import { getMetadata } from 'js/helpers/metadata';
import { Dataset, Donor, ESEntityType, Sample, isDataset, isSample } from 'js/components/types';
import { ProcessedDatasetInfo, useProcessedDatasets } from 'js/pages/Dataset/hooks';
import { MUIIcon, entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { DownloadIcon, StyledWhiteBackgroundIconButton } from '../MetadataTable/style';
import MetadataTabs from '../multi-assay/MultiAssayMetadataTabs';
import { Columns, defaultTSVColumns } from './columns';
import { SectionDescription } from '../ProcessedData/ProcessedDataset/SectionDescription';
import { nodeIcons } from '../DatasetRelationships/nodeTypes';

export function getDescription(
  field: string,
  metadataFieldDescriptions: Record<string, string> | Record<string, never>,
) {
  const [prefix, stem] = field.split('.');
  if (!stem) {
    return metadataFieldDescriptions?.[field];
  }
  const description = metadataFieldDescriptions?.[stem];
  if (!description) {
    return undefined;
  }
  if (prefix === 'donor') {
    return `For the original donor: ${metadataFieldDescriptions?.[stem]}`;
  }
  if (prefix === 'sample') {
    return `For the original sample: ${metadataFieldDescriptions?.[stem]}`;
  }
  throw new Error(`Unrecognized metadata field prefix: ${prefix}`);
}

export function buildTableData(
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
        description: getDescription(entry[0], metadataFieldDescriptions),
      }))
  );
}

interface TableRow {
  key: string;
  value: string;
  description: string | undefined;
}

export type TableRows = TableRow[];

type MetadataWrapperProps = PropsWithChildren<{
  allTableRows: TableRows;
  tsvColumns?: Columns;
}>;

function MetadataWrapper({ allTableRows, tsvColumns = defaultTSVColumns, children }: MetadataWrapperProps) {
  const {
    entity: { hubmap_id, ...entity },
  } = useFlaskDataContext();

  const trackEntityPageEvent = useTrackEntityPageEvent();

  const downloadUrl = createDownloadUrl(
    tableToDelimitedString(
      allTableRows,
      tsvColumns.map((col) => col.label),
      '\t',
    ),
    'text/tab-separated-values',
  );

  const entityIsDataset = isDataset(entity);

  return (
    <CollapsibleDetailPageSection
      id="metadata"
      title="Metadata"
      icon={sectionIconMap.metadata}
      action={
        <SecondaryBackgroundTooltip title="Download">
          <a href={downloadUrl} download={`${hubmap_id}.tsv`} aria-label="Download TSV of selected items' metadata">
            <StyledWhiteBackgroundIconButton
              onClick={() => trackEntityPageEvent({ action: `Metadata / Download Metadata` })}
            >
              <DownloadIcon color="primary" />
            </StyledWhiteBackgroundIconButton>
          </a>
        </SecondaryBackgroundTooltip>
      }
    >
      <SectionDescription>
        This is the list of metadata that was provided by the data provider.
        {entityIsDataset && ' Metadata from the donor or sample of this dataset may also be included in this list.'}
      </SectionDescription>
      {children}
    </CollapsibleDetailPageSection>
  );
}

function getEntityIcon(entity: { entity_type: ESEntityType; is_component?: boolean; processing?: string }) {
  if (isDataset(entity)) {
    if (entity.is_component) {
      return nodeIcons.componentDataset;
    }
    if (entity.processing === 'processed') {
      return nodeIcons.processedDataset;
    }
    return nodeIcons.primaryDataset;
  }
  return entityIconMap[entity.entity_type];
}

interface sortEntitiesProps {
  tableEntities: {
    uuid: string;
    label: string;
    icon: MUIIcon;
    tableRows: TableRows;
    entity_type: ESEntityType;
    hubmap_id: string;
  }[];
  uuid: string;
}

function sortEntities({ tableEntities, uuid }: sortEntitiesProps) {
  return tableEntities.sort((a, b) => {
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
    return entity.assay_display_name;
  }
  return entity.entity_type;
}

interface getTableEntitiesProps {
  entities: (Donor | Dataset | Sample)[];
  uuid: string;
  fieldDescriptions: Record<string, string>;
}

function getTableEntities({ entities, uuid, fieldDescriptions }: getTableEntitiesProps) {
  // Check whether there are multiple samples with the same sample category
  const sampleCategoryCounts: Record<string, number> = {};
  entities.forEach((e) => {
    if (isSample(e)) {
      sampleCategoryCounts[e.sample_category] = (sampleCategoryCounts[e.sample_category] || 0) + 1;
    }
  });

  const tableEntities = entities.map((entity) => {
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

interface MetadataProps {
  entities: (Donor | Dataset | Sample)[];
}

function Metadata({ entities }: MetadataProps) {
  const { searchHits: datasetsWithMetadata, isLoading } = useProcessedDatasets(true);
  const { data: fieldDescriptions } = useMetadataFieldDescriptions();
  const {
    entity: { uuid },
  } = useFlaskDataContext();

  if (isLoading || !datasetsWithMetadata) {
    return null;
  }

  const tableEntities = getTableEntities({ entities, uuid, fieldDescriptions });
  const allTableRows = tableEntities.map((d) => d.tableRows).flat();

  return (
    <MetadataWrapper
      allTableRows={allTableRows}
      tsvColumns={[{ id: 'hubmap_id', label: 'HuBMAP ID' }, { id: 'label', label: 'Entity' }, ...defaultTSVColumns]}
    >
      <MetadataTabs entities={tableEntities} />
    </MetadataWrapper>
  );
}

export default withShouldDisplay(Metadata);
