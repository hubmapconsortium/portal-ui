import React, { PropsWithChildren } from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { DetailPageSection } from 'js/components/detailPage/style';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { tableToDelimitedString, createDownloadUrl } from 'js/helpers/functions';
import { useMetadataFieldDescriptions } from 'js/hooks/useUBKG';
import { getMetadata, hasMetadata } from 'js/helpers/metadata';
import { isDataset } from 'js/components/types';
import { useProcessedDatasets } from 'js/pages/Dataset/hooks';
import { DownloadIcon, Flex, StyledWhiteBackgroundIconButton } from '../MetadataTable/style';
import MetadataTabs from '../multi-assay/MultiAssayMetadataTabs';
import { Columns, defaultTSVColumns } from './columns';
import { SectionDescription } from '../ProcessedData/ProcessedDataset/SectionDescription';
import MetadataTable from '../MetadataTable';

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

function useTableData(tableData: Record<string, string>) {
  const { data: fieldDescriptions } = useMetadataFieldDescriptions();
  return buildTableData(tableData, fieldDescriptions);
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
    <DetailPageSection id="metadata">
      <Flex>
        <SectionHeader>Metadata</SectionHeader>
        <SecondaryBackgroundTooltip title="Download">
          <a href={downloadUrl} download={`${hubmap_id}.tsv`} aria-label="Download TSV of selected items' metadata">
            <StyledWhiteBackgroundIconButton
              onClick={() => trackEntityPageEvent({ action: `Metadata / Download Metadata` })}
            >
              <DownloadIcon color="primary" />
            </StyledWhiteBackgroundIconButton>
          </a>
        </SecondaryBackgroundTooltip>
      </Flex>
      <SectionDescription>
        This is the list of metadata that was provided by the data provider.
        {entityIsDataset && ' Metadata from the donor or sample of this dataset may also be included in this list.'}
      </SectionDescription>
      {children}
    </DetailPageSection>
  );
}

function SingleMetadata({ metadata }: { metadata: Record<string, string> }) {
  const tableRows = useTableData(metadata);

  return (
    <MetadataWrapper allTableRows={tableRows}>
      <MetadataTable tableRows={tableRows} />
    </MetadataWrapper>
  );
}

interface MetadataProps {
  metadata?: Record<string, string>;
}

function Metadata({ metadata }: MetadataProps) {
  const { searchHits: datasetsWithMetadata, isLoading } = useProcessedDatasets(true);
  const { data: fieldDescriptions } = useMetadataFieldDescriptions();

  const { entity } = useFlaskDataContext();

  if (!isDataset(entity)) {
    return <SingleMetadata metadata={metadata!} />;
  }

  if (isLoading || !datasetsWithMetadata) {
    return null;
  }

  const { donor } = entity;

  const entities = [entity, ...datasetsWithMetadata.map((d) => d._source), donor]
    .filter((e) => hasMetadata({ targetEntityType: e.entity_type, currentEntity: e }))
    .map((e) => {
      const label = isDataset(e) ? e.assay_display_name : e.entity_type;
      return {
        uuid: e.uuid,
        label,
        tableRows: buildTableData(
          getMetadata({
            targetEntityType: e.entity_type,
            currentEntity: e,
          }),
          fieldDescriptions,
          { hubmap_id: e.hubmap_id, label },
        ),
      };
    });

  const allTableRows = entities.map((d) => d.tableRows).flat();

  return (
    <MetadataWrapper
      allTableRows={allTableRows}
      tsvColumns={[{ id: 'hubmap_id', label: 'HuBMAP ID' }, { id: 'label', label: 'Entity' }, ...defaultTSVColumns]}
    >
      <MetadataTabs entities={entities} />
    </MetadataWrapper>
  );
}

export default Metadata;
