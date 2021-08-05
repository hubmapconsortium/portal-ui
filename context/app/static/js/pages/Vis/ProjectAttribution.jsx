import React from 'react';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import SectionItem from 'js/components/Detail/SectionItem';

import { StyledSectionPaper, ChartTitle } from './style';

function ProjectAttribution() {
  return (
    <SectionContainer id="attribution">
      <ChartTitle variant="h2">Attribution</ChartTitle>
      <StyledSectionPaper>
        <SectionItem label="Creator">Roselkis Morla-Adames</SectionItem>
        <SectionItem label="PI" ml={1}>
          Nils Gehlenborg
        </SectionItem>
        <SectionItem label="Funding" ml={1}>
          NIH HuBMAP Underepresented Student Internship
        </SectionItem>
      </StyledSectionPaper>
    </SectionContainer>
  );
}

export default ProjectAttribution;
