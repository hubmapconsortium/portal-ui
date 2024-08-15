import React, { PropsWithChildren } from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import { Alert } from 'js/shared-styles/alerts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import DetailPageSection, { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import Skeleton from '@mui/material/Skeleton';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import useProvData from '../hooks';
import ProvTabs from '../ProvTabs';
import { SectionDescription } from '../../ProcessedData/ProcessedDataset/SectionDescription';

const provenanceTooltipText = `The provenance shows the sequence of events and actions that led to this page creation.`;

function ProvSectionWrapper({ children }: PropsWithChildren) {
  return (
    <DetailPageSection id="provenance">
      <SectionHeader iconTooltipText={provenanceTooltipText}>Provenance</SectionHeader>
      {children}
    </DetailPageSection>
  );
}

function ProvSectionLoading() {
  return (
    <ProvSectionWrapper>
      <Skeleton variant="rectangular" height={300} />
    </ProvSectionWrapper>
  );
}

function ProvSectionNoData({ entity_type }: { entity_type: string }) {
  return (
    <ProvSectionWrapper>
      <Alert severity="warning">
        We were unable to retrieve provenance information for this {entity_type.toLowerCase()}.
      </Alert>
    </ProvSectionWrapper>
  );
}

const DatasetDescription = (
  <>
    The provenance displays the sequence of events and actions that led to the creation of this dataset. The table view
    provides a basic overview of the dataset&apos;s origin, from donor to sample level, and any processing that has been
    done to the dataset. The graph view offers a comprehensive overview of the data&apos;s provenance.
  </>
);

function Description() {
  const {
    entity: { entity_type },
  } = useFlaskDataContext();
  if (entity_type === 'Dataset') {
    return DatasetDescription;
  }
  return (
    <>
      The provenance displays the sequence of events and actions that led to the creation of this{' '}
      {entity_type.toLowerCase()}.
    </>
  );
}

function ProvSection() {
  const {
    entity: { uuid, entity_type },
  } = useFlaskDataContext();
  // Load combined provenance data for datasets only for now
  const { provData, isLoading } = useProvData(uuid, entity_type === 'Dataset');

  if (isLoading) {
    return <ProvSectionLoading />;
  }

  if (!provData) {
    return <ProvSectionNoData entity_type={entity_type} />;
  }

  return (
    <CollapsibleDetailPageSection id="provenance" title="Provenance" icon={sectionIconMap.provenance}>
      <SectionDescription>
        <Description />
      </SectionDescription>
      <ProvTabs provData={provData} />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(ProvSection);
