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
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import { getTableEntities } from 'js/components/detailPage/MetadataSection/utils';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { DownloadIcon } from '../MetadataTable/style';
import MetadataTabs from '../multi-assay/MultiAssayMetadataTabs';
import { Columns, defaultTSVColumns } from './columns';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import MetadataTable from '../MetadataTable';

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

function DatasetDescriptionNote() {
  return (
    <>
      &nbsp;Metadata from the donor or sample of this dataset may also be included in this list.
      <br />
      Additional information about the metadata available for each type of dataset can be found in the&nbsp;
      <OutboundIconLink href="https://docs.hubmapconsortium.org/metadata">HuBMAP documentation.</OutboundIconLink>
    </>
  );
}

function MetadataWrapper({ allTableRows, tsvColumns = defaultTSVColumns, children }: MetadataWrapperProps) {
  const {
    entity: { hubmap_id, is_integrated, ...entity },
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
          <a href={downloadUrl} download={`${hubmap_id}.tsv`}>
            <WhiteBackgroundIconButton
              aria-label="Download TSV of selected items' metadata"
              onClick={() => {
                trackEntityPageEvent({ action: `Metadata / Download Metadata` });
              }}
            >
              <DownloadIcon color="primary" />
            </WhiteBackgroundIconButton>
          </a>
        </SecondaryBackgroundTooltip>
      }
    >
      <SectionDescription>
        This is the list of metadata that was provided by the data provider.
        {entityIsDataset && !is_integrated && <DatasetDescriptionNote />}
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
      {tableEntities.length > 1 ? (
        <MetadataTabs entities={tableEntities} />
      ) : (
        <MetadataTable tableRows={tableEntities[0].tableRows} />
      )}
    </MetadataWrapper>
  );
}

export default withShouldDisplay(Metadata);
