import React from 'react';
import Stack from '@mui/material/Stack';

import OutboundLinkButton from 'js/shared-styles/Links/OutboundLinkButton';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper/VisualizationWrapper';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { useOrganContext } from 'js/components/organ/contexts';
import { OrganPageIds } from 'js/components/organ/types';
import OrganDetailSection from 'js/components/organ/OrganDetailSection';
import ReferenceBasedAnalysis from './ReferenceBasedAnalysis';

const title = 'Reference-Based Analysis';

function Azimuth() {
  const {
    organ: { azimuth },
  } = useOrganContext();

  if (!azimuth) {
    return null;
  }

  return (
    <OrganDetailSection
      id={OrganPageIds.referenceId}
      title={title}
      iconTooltipText="Analysis provided by Azimuth that uses an annotated reference dataset to automate the processing, analysis and interpretation of a single-cell RNA-seq experiment."
      action={
        <OutboundLinkButton href={azimuth.applink} component="a">
          Open Azimuth App
        </OutboundLinkButton>
      }
    >
      <Stack dir="column" gap={1}>
        <ReferenceBasedAnalysis {...azimuth} wrapped />
        <VisualizationWrapper vitData={azimuth.vitessce_conf} shouldDisplayHeader={false} />
      </Stack>
    </OrganDetailSection>
  );
}

export default withShouldDisplay(Azimuth);
