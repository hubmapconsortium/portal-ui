import React, { useState } from 'react';
import Accordion from '@material-ui/core/ExpansionPanel';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';

import PublicationVignette from 'js/components/publications/PublicationVignette';
import PrimaryColorAccordionSummary from 'js/shared-styles/accordions/PrimaryColorAccordionSummary';

function PublicationsVisualizationSection({ vignette_data, uuid }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleChange = (i) => (event, isExpanded) => {
    setExpandedIndex(isExpanded ? i : false);
  };

  return Object.entries(vignette_data).map(([k, v], i) => {
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
        <AccordionDetails style={{ 'flex-direction': 'column' }}>
          <PublicationVignette vignette={v} uuid={uuid} vignetteDirName={k} />;
        </AccordionDetails>
      </Accordion>
    );
  });
}

export default PublicationsVisualizationSection;
