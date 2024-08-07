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
import { DownloadIcon, Flex, StyledWhiteBackgroundIconButton } from '../MetadataTable/style';
import MultiAssayMetadataTabs from '../multi-assay/MultiAssayMetadataTabs';
import MetadataTable from '../MetadataTable';
import { useRelatedMultiAssayMetadata } from '../multi-assay/useRelatedMultiAssayDatasets';
import { Columns, defaultTSVColumns } from './columns';

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
  buildTooltip: (entity_type: string) => string;
}>;

function MetadataWrapper({
  allTableRows,
  buildTooltip,
  tsvColumns = defaultTSVColumns,
  children,
}: MetadataWrapperProps) {
  const {
    entity: { entity_type, hubmap_id },
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

  return (
    <DetailPageSection id="metadata">
      <Flex>
        <SectionHeader iconTooltipText={buildTooltip(entity_type)}>Metadata</SectionHeader>
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
      {children}
    </DetailPageSection>
  );
}

const buildMultiAssayTooltip = (entity_type: string) =>
  `Data provided for all ${entity_type.toLowerCase()}s involved in the multi-assay.`;

function MultiAssayMetadata() {
  const datasetsWithMetadata = useRelatedMultiAssayMetadata();
  const { data: fieldDescriptions } = useMetadataFieldDescriptions();

  const { entity } = useFlaskDataContext();

  if (!isDataset(entity)) {
    throw new Error(`Expected entity to be a dataset, got ${entity.entity_type}`);
  }

  const { donor } = entity;

  const entities = [donor, ...datasetsWithMetadata]
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
      buildTooltip={buildMultiAssayTooltip}
      tsvColumns={[{ id: 'hubmap_id', label: 'HuBMAP ID' }, { id: 'label', label: 'Entity' }, ...defaultTSVColumns]}
    >
      <MultiAssayMetadataTabs entities={entities} />
    </MetadataWrapper>
  );
}

const buildMetadataTooltip = (entity_type: string) => `Data provided for the given ${entity_type?.toLowerCase()}.`;

function Metadata({ metadata }: { metadata: Record<string, string> }) {
  const tableRows = useTableData(metadata);

  return (
    <MetadataWrapper allTableRows={tableRows} buildTooltip={buildMetadataTooltip}>
      <MetadataTable tableRows={tableRows} />
    </MetadataWrapper>
  );
}

type MetadataSectionProps =
  | {
      assay_modality: 'single';
      metadata: Record<string, string>;
    }
  | {
      assay_modality: 'multiple';
      metadata: undefined;
    };

function MetadataSection({ metadata, assay_modality }: MetadataSectionProps) {
  if (assay_modality === 'multiple') {
    return <MultiAssayMetadata />;
  }

  return <Metadata metadata={metadata} />;
}

export default MetadataSection;
