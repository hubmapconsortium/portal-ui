import React, { PropsWithChildren } from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { DetailPageSection } from 'js/components/detailPage/style';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { tableToDelimitedString, createDownloadUrl } from 'js/helpers/functions';
import metadataFieldDescriptions from 'metadata-field-descriptions';
import { DownloadIcon, Flex, StyledWhiteBackgroundIconButton } from '../MetadataTable/style';
import MultiAssayMetadataTabs from '../multi-assay/MultiAssayMetadataTabs';
import MetadataTable from '../MetadataTable';
import useRelatedMultiAssayDatasets from '../multi-assay/useRelatedMultiAssayDatasets';

function getDescription(field: string) {
  const [prefix, stem] = field.split('.');
  if (!stem) {
    return metadataFieldDescriptions[field];
  }
  const description = metadataFieldDescriptions[stem];
  if (!description) {
    return undefined;
  }
  if (prefix === 'donor') {
    return `For the original donor: ${metadataFieldDescriptions[stem]}`;
  }
  if (prefix === 'sample') {
    return `For the original sample: ${metadataFieldDescriptions[stem]}`;
  }
  throw new Error(`Unrecognized metadata field prefix: ${prefix}`);
}

function tableDataToRows(tableData: Record<string, string>) {
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
        description: getDescription(entry[0]),
      }))
  );
}

interface TableRows {
  key: string;
  value: string;
  description: string | undefined;
}

type MetadataWrapperProps = PropsWithChildren<{
  allTableRows: TableRows[];
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
  const { datasets } = useRelatedMultiAssayDatasets();

  const datasetsWithMetadata = Object.values(datasets)
    .flat()
    .filter((d) => d?.metadata?.metadata);

  const tableRows = tableDataToRows(
    datasetsWithMetadata.reduce((acc, curr) => {
      return { ...acc, ...curr.metadata?.metadata };
    }, {}),
  );

  return (
    <MetadataWrapper allTableRows={tableRows} buildTooltip={buildMultiAssayTooltip}>
      <MultiAssayMetadataTabs datasets={datasetsWithMetadata} />
    </MetadataWrapper>
  );
}

const buildMetadataTooltip = (entity_type: string) => `Data provided for the given ${entity_type?.toLowerCase()}.`;

function Metadata({ metadata }: { metadata: Record<string, string> }) {
  const tableRows = tableDataToRows(metadata);

  return (
    <MetadataWrapper allTableRows={tableRows} buildTooltip={buildMetadataTooltip}>
      <MetadataTable metadata={metadata} />
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
