import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import React, { useCallback, useMemo, useState } from 'react';

import DetailPageSection from 'js/components/detailPage/DetailPageSection';
import PublicationVignette from 'js/components/publications/PublicationVignette';
import PrimaryColorAccordionSummary from 'js/shared-styles/accordions/PrimaryColorAccordionSummary';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { StyledAccordionDetails } from './style';

function PublicationsVisualizationSection({ vignette_json: { vignettes }, uuid }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const [displayedVignettes, setDisplayedVignettes] = useState({
    ...[true].concat(Array(vignettes.length - 1).fill(false)),
  });

  const sortedVignettes = useMemo(() => {
    return vignettes.sort((a, b) => a.directory_name.localeCompare(b.directory_name));
  }, [vignettes]);

  const handleChange = useCallback((i) => (event, isExpanded) => setExpandedIndex(isExpanded ? i : false), []);

  return (
    <DetailPageSection id="visualizations" data-testid="vignettes">
      <SectionHeader>Visualizations</SectionHeader>
      {sortedVignettes.map((vignette, i) => {
        return (
          <Accordion
            key={vignette.name}
            expanded={i === expandedIndex}
            TransitionProps={{ onEntered: () => setDisplayedVignettes((prev) => ({ ...prev, [i]: true })) }}
            onChange={handleChange(i)}
            data-testid="vignette"
          >
            <PrimaryColorAccordionSummary
              $isExpanded={i === expandedIndex}
              expandIcon={<ArrowDropUpRoundedIcon />}
              data-testid={`vignette-${i}-button`}
            >
              <Typography variant="subtitle1">{`Vignette ${i + 1}: ${vignette.name}`}</Typography>
            </PrimaryColorAccordionSummary>
            <StyledAccordionDetails data-testid={`vignette-${i}-content`}>
              <PublicationVignette
                vignette={vignette}
                uuid={uuid}
                vignetteDirName={vignette.directory_name}
                mounted={displayedVignettes[i]}
              />
            </StyledAccordionDetails>
          </Accordion>
        );
      })}
    </DetailPageSection>
  );
}

export default PublicationsVisualizationSection;
