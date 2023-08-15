import React from 'react';
import marked from 'marked';
import Box from '@mui/material/Box';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import OutboundLinkButton from 'js/shared-styles/Links/OutboundLinkButton';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper/VisualizationWrapper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import { Flex, StyledInfoIcon } from '../style';
import { StyledPaper } from './style';

function Azimuth({ config }) {
  const dataRefHtml = marked.parseInline(config.dataref);

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
      <StyledPaper>
        <LabelledSectionText label="Modalities">{config.modalities}</LabelledSectionText>
        <LabelledSectionText label="Nuclei in reference">{config.nunit}</LabelledSectionText>
        {/* eslint-disable react/no-danger */}
        <LabelledSectionText label="Reference dataset">
          <Box
            component="span"
            sx={(theme) => ({ '&>a': { color: theme.palette.info.main } })}
            dangerouslySetInnerHTML={{ __html: dataRefHtml }}
          />
        </LabelledSectionText>
      </StyledPaper>

      {/* TODO: Refactor so "Visualization" is not included... */}
      {/* TODO: ... and then remove the <br> as well. */}
      <br />
      <VisualizationWrapper vitData={config.vitessce_conf} shouldDisplayHeader={false} />
    </>
  );
}

export default Azimuth;
