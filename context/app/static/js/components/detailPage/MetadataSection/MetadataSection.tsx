import React, { PropsWithChildren } from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { DetailPageSection } from 'js/components/detailPage/style';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { tableToDelimitedString, createDownloadUrl } from 'js/helpers/functions';
import { useMetadataFieldDescriptions } from 'js/hooks/useUBKG';
import { getMetadata, hasMetadata } from 'js/helpers/metadata';
import { DownloadIcon, Flex, StyledWhiteBackgroundIconButton } from '../MetadataTable/style';
import MultiAssayMetadataTabs from '../multi-assay/MultiAssayMetadataTabs';
import MetadataTable from '../MetadataTable';
import { useRelatedMultiAssayMetadata } from '../multi-assay/useRelatedMultiAssayDatasets';

function getDescription(field: string, metadataFieldDescriptions: Record<string, string> | Record<string, never>) {
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

function buildTableData(
  tableData: Record<string, string>,
  metadataFieldDescriptions: Record<string, string> | Record<string, never>,
) {
  return (
    Object.entries(tableData)
      // Filter out nested objects, like nested "metadata" for Samples...
      // but allow arrays. Remember, in JS: typeof [] === 'object'
      .filter((entry) => typeof entry[1] !== 'object' || Array.isArray(entry[1]))
      // Filter out fields from TSV that aren't really metadata:
      .filter((entry) => !['contributors_path', 'antibodies_path', 'version'].includes(entry[0]))
      .map((entry) => ({
        key: entry[0],
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
  buildTooltip: (entity_type: string) => string;
}>;

function MetadataWrapper({ allTableRows, buildTooltip, children }: MetadataWrapperProps) {
  const {
    entity: { entity_type, hubmap_id },
  } = useFlaskDataContext();

  const trackEntityPageEvent = useTrackEntityPageEvent();

  const columns = [
    { id: 'key', label: 'Key' },
    { id: 'value', label: 'Value' },
  ];

  const downloadUrl = createDownloadUrl(
    tableToDelimitedString(
      allTableRows,
      columns.map((col) => col.label),
      '\t',
    ),
    'text/tab-separated-values',
  );

  return (
    <DetailPageSection id="metadata">
      <Flex>
        <SectionHeader iconTooltipText={buildTooltip(entity_type)}>Metadata</SectionHeader>
        <SecondaryBackgroundTooltip title="Download">
          <a href={downloadUrl} download={`${hubmap_id}.tsv`}>
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

  const {
    entity: { donor },
  } = useFlaskDataContext();

  const entities = [donor, ...datasetsWithMetadata]
    .filter((e) => hasMetadata({ targetEntityType: e.entity_type, currentEntity: e }))
    .map((e) => ({
      uuid: e.uuid,
      label: e.entity_type === 'Donor' ? 'Donor' : e.assay_display_name,
      tableRows: buildTableData(
        getMetadata({
          targetEntityType: e.entity_type,
          currentEntity: e,
        }),
        fieldDescriptions,
      ),
    }));
  const allTableRows = entities.map((d) => d.tableRows).flat();

  return (
    <MetadataWrapper allTableRows={allTableRows} buildTooltip={buildMultiAssayTooltip}>
      <MultiAssayMetadataTabs datasets={entities} />
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
