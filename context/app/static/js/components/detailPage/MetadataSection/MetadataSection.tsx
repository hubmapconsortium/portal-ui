import React, { PropsWithChildren } from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { tableToDelimitedString, createDownloadUrl } from 'js/helpers/functions';
import { useMetadataFieldDescriptions } from 'js/hooks/useUBKG';
import { Dataset, Donor, Sample, isDataset } from 'js/components/types';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { getTableEntities } from 'js/components/detailPage/MetadataSection/utils';
import { DownloadIcon, StyledWhiteBackgroundIconButton } from '../MetadataTable/style';
import MetadataTabs from '../multi-assay/MultiAssayMetadataTabs';
import { SectionDescription } from '../ProcessedData/ProcessedDataset/SectionDescription';
import { Columns, defaultTSVColumns } from './columns';

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

interface MetadataProps {
  entities: (Donor | Dataset | Sample)[];
}

function Metadata({ entities }: MetadataProps) {
  const { data: fieldDescriptions } = useMetadataFieldDescriptions();
  const {
    entity: { uuid },
  } = useFlaskDataContext();

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
