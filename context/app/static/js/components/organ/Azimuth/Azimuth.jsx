import React from 'react';
import marked from 'marked';

import Button from '@material-ui/core/Button';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import VisualizationWrapper from 'js/components/Detail/visualization/VisualizationWrapper/VisualizationWrapper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import { StyledPaper } from './style';

function Azimuth(props) {
  const { config } = props;
  const datarefHtml = marked(config.dataref);
  const demodataHtml = marked(config.demodata);
  const detailsHtml = marked(config.details);

  return (
    <SectionContainer>
      TODO: Add info popover.
      <SpacedSectionButtonRow
        leftText={<SectionHeader>Reference-Based Analysis</SectionHeader>}
        buttons={
          <Button color="primary" variant="contained" component="a" href={config.applink}>
            Open Azimuth App
          </Button>
        }
      />
      <StyledPaper>
        <LabelledSectionText label="Modalities">{config.modalities}</LabelledSectionText>
        <LabelledSectionText label="Nuclei in reference">{config.nunit}</LabelledSectionText>
        TODO: Which of the following should be shown?
        {/* eslint-disable react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: datarefHtml }} />
        <div dangerouslySetInnerHTML={{ __html: demodataHtml }} />
        <div dangerouslySetInnerHTML={{ __html: detailsHtml }} />
      </StyledPaper>
      TODO: Refactor so that can get the spinner without the a title?
      <VisualizationWrapper vitData={config.vitessce_conf} />
    </SectionContainer>
  );
}

export default Azimuth;
