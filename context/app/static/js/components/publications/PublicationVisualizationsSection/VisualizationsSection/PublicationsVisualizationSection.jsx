import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { Typography } from '@material-ui/core';

import PublicationVignette from 'js/components/publications/PublicationVignette';

function PublicationsVisualizationSection({ vignette_data, uuid }) {
  return Object.entries(vignette_data).map(([k, v], i) => {
    return (
      <Accordion key={k} defaultExpanded={i === 0} TransitionProps={{ mountOnEnter: i !== 0 }}>
        <AccordionSummary>
          <Typography variant="subtitle1">{`Vignette ${i + 1}: ${v.name}`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PublicationVignette vignette={v} uuid={uuid} vignetteDirName={k} />;
        </AccordionDetails>
      </Accordion>
    );
  });
}

export default PublicationsVisualizationSection;
