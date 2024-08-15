import React from 'react';
import Stack from '@mui/material/Stack';

import OutboundLinkButton from 'js/shared-styles/Links/OutboundLinkButton';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper/VisualizationWrapper';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import ReferenceBasedAnalysis from './ReferenceBasedAnalysis';
import { AzimuthConfig } from '../types';

interface AzimuthProps {
  config: AzimuthConfig;
  id: string;
}

function Azimuth({ config, id }: AzimuthProps) {
  return (
    <CollapsibleDetailPageSection
      id={id}
      title="Reference-Based Analysis"
      iconTooltipText="Analysis provided by Azimuth that uses an annotated reference dataset to automate the processing, analysis and interpretation of a single-cell RNA-seq experiment."
      action={
        <OutboundLinkButton href={config.applink} component="a">
          Open Azimuth App
        </OutboundLinkButton>
      }
    >
      <Stack dir="column" gap={1}>
        <ReferenceBasedAnalysis {...config} wrapped />
        <VisualizationWrapper vitData={config.vitessce_conf} shouldDisplayHeader={false} />
      </Stack>
    </CollapsibleDetailPageSection>
  );
}

export default Azimuth;
