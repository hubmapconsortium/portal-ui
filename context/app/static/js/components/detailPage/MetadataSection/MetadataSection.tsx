import React, { PropsWithChildren } from 'react';
import Button from '@mui/material/Button';

import { useFlaskDataContext } from 'js/components/Contexts';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { Dataset, Donor, Sample, isDataset } from 'js/components/types';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import { DownloadIcon } from '../MetadataTable/style';
import MetadataTabs from '../multi-assay/MultiAssayMetadataTabs';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import MetadataTable from '../MetadataTable';
import { useMetadataEntityDownloads } from './hooks';

interface TableRow {
  key: string;
  value: string;
  description: string | undefined;
}

export type TableRows = TableRow[];

interface MetadataWrapperProps extends PropsWithChildren {
  downloadUrl: string;
}

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

const nonIntegratedTooltip = 'Download all TSV metadata for the current dataset and related entities.';
const integratedTooltip = 'Download all TSV metadata for the current and the entities it was derived from.';

function MetadataWrapper({ downloadUrl, children }: MetadataWrapperProps) {
  const {
    entity: { hubmap_id, is_integrated, ...entity },
  } = useFlaskDataContext();

  const trackEntityPageEvent = useTrackEntityPageEvent();

  const entityIsDataset = isDataset(entity);

  const tooltip = is_integrated ? integratedTooltip : nonIntegratedTooltip;

  return (
    <CollapsibleDetailPageSection
      id="metadata"
      title="Metadata"
      icon={sectionIconMap.metadata}
      action={
        <SecondaryBackgroundTooltip title={tooltip}>
          <Button
            aria-label={tooltip}
            onClick={() => {
              trackEntityPageEvent({ action: `Metadata / Download Metadata` });
            }}
            LinkComponent={'a'}
            href={downloadUrl}
            download={`${hubmap_id}.tsv`}
            variant="contained"
            startIcon={<DownloadIcon color="white" />}
          >
            Download
          </Button>
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
  const { tableEntities, downloadUrl } = useMetadataEntityDownloads(entities);

  return (
    <MetadataWrapper downloadUrl={downloadUrl}>
      {tableEntities.length > 1 ? (
        <MetadataTabs entities={tableEntities} />
      ) : (
        <MetadataTable tableRows={tableEntities[0].tableRows} />
      )}
    </MetadataWrapper>
  );
}

export default withShouldDisplay(Metadata);
