import React, { useState } from 'react';
import Accordion from '@material-ui/core/ExpansionPanel';
import Typography from '@material-ui/core/Typography';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import PublicationVignette from 'js/components/publications/PublicationVignette';
import PrimaryColorAccordionSummary from 'js/shared-styles/accordions/PrimaryColorAccordionSummary';
import { StyledAccordionDetails } from './style';

function PublicationsVisualizationSection({ vignette_data, uuid }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleChange = (i) => (event, isExpanded) => {
    setExpandedIndex(isExpanded ? i : false);
  };

  return (
    <DetailPageSection id="visualizations">
      <SectionHeader>Visualizations</SectionHeader>
      {Object.entries(vignette_data).map(([k, v], i) => {
        return (
          <Accordion
            key={k}
            expanded={i === expandedIndex}
            TransitionProps={{ mountOnEnter: i !== 0 }}
            onChange={handleChange(i)}
          >
            <PrimaryColorAccordionSummary $isExpanded={i === expandedIndex} expandIcon={<ArrowDropUpRoundedIcon />}>
              <Typography variant="subtitle1">{`Vignette ${i + 1}: ${v.name}`}</Typography>
            </PrimaryColorAccordionSummary>
            <StyledAccordionDetails>
              <PublicationVignette vignette={v} uuid={uuid} vignetteDirName={k} />
            </StyledAccordionDetails>
          </Accordion>
        );
      })}
    </DetailPageSection>
  );
}

export default PublicationsVisualizationSection;
