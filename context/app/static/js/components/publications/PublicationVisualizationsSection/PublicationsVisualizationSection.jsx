import React, { useState } from 'react';
import Accordion from '@material-ui/core/ExpansionPanel';
import Typography from '@material-ui/core/Typography';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import PublicationVignette from 'js/components/publications/PublicationVignette';
import PrimaryColorAccordionSummary from 'js/shared-styles/accordions/PrimaryColorAccordionSummary';
import { StyledAccordionDetails } from './style';

function PublicationsVisualizationSection({ vignette_json: { vignettes }, uuid }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleChange = (i) => (event, isExpanded) => {
    setExpandedIndex(isExpanded ? i : false);
  };

  return (
    <DetailPageSection id="visualizations">
      <SectionHeader>Visualizations</SectionHeader>
      {vignettes
        .sort((a, b) => a.directory_name.localeCompare(b.directory_name))
        .map((vignette, i) => {
          return (
            <Accordion
              key={vignette.name}
              expanded={i === expandedIndex}
              TransitionProps={{ mountOnEnter: i !== 0 }}
              onChange={handleChange(i)}
            >
              <PrimaryColorAccordionSummary $isExpanded={i === expandedIndex} expandIcon={<ArrowDropUpRoundedIcon />}>
                <Typography variant="subtitle1">{`Vignette ${i + 1}: ${vignette.name}`}</Typography>
              </PrimaryColorAccordionSummary>
              <StyledAccordionDetails>
                <PublicationVignette vignette={vignette} uuid={uuid} vignetteDirName={vignette.directory_name} />
              </StyledAccordionDetails>
            </Accordion>
          );
        })}
    </DetailPageSection>
  );
}

export default PublicationsVisualizationSection;
