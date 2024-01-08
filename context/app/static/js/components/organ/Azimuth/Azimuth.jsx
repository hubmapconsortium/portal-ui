import React from 'react';
import Stack from '@mui/material/Stack';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import OutboundLinkButton from 'js/shared-styles/Links/OutboundLinkButton';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper/VisualizationWrapper';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import { Flex, StyledInfoIcon } from '../style';
import ReferenceBasedAnalysis from './ReferenceBasedAnalysis';

function Azimuth({ config }) {
  return (
    <>
      <SpacedSectionButtonRow
        leftText={
          <Flex>
            <SectionHeader>Reference-Based Analysis</SectionHeader>
            <SecondaryBackgroundTooltip title="Analysis provided by Azimuth that uses an annotated reference dataset to automate the processing, analysis and interpretation of a single-cell RNA-seq experiment.">
              <StyledInfoIcon color="primary" />
            </SecondaryBackgroundTooltip>
          </Flex>
        }
        buttons={<OutboundLinkButton href={config.applink}>Open Azimuth App</OutboundLinkButton>}
      />
      <Stack dir="column" gap={1}>
        <ReferenceBasedAnalysis {...config} />
        <VisualizationWrapper vitData={config.vitessce_conf} shouldDisplayHeader={false} />
      </Stack>
    </>
  );
}

export default Azimuth;
