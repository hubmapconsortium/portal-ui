import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import React, { useCallback, useMemo, useState } from 'react';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import PublicationVignette from 'js/components/publications/PublicationVignette';
import PrimaryColorAccordionSummary from 'js/shared-styles/accordions/PrimaryColorAccordionSummary';
import { StyledAccordionDetails } from './style';

interface PublicationsVisualizationSectionProps {
  vignette_json: {
    vignettes: { name: string; directory_name: string }[];
  };
  uuid: string;
}

function PublicationsVisualizationSection({
  vignette_json: { vignettes },
  uuid,
}: PublicationsVisualizationSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | false>(0);

  const [displayedVignettes, setDisplayedVignettes] = useState({
    ...[true].concat(Array(vignettes.length - 1).fill(false)),
  });

  const sortedVignettes = useMemo(() => {
    return vignettes.sort((a, b) => a.directory_name.localeCompare(b.directory_name));
  }, [vignettes]);

  const handleChange = useCallback(
    (i: number) => (_: unknown, isExpanded: boolean) => {
      setExpandedIndex(isExpanded ? i : false);
    },
    [],
  );

  return (
    <CollapsibleDetailPageSection id="visualizations" data-testid="vignettes" title="Visualizations">
      {sortedVignettes.map((vignette, i) => {
        return (
          <Accordion
            key={vignette.name}
            expanded={i === expandedIndex}
            slotProps={{
              transition: {
                onEntered: () => {
                  setDisplayedVignettes((prev) => ({ ...prev, [i]: true }));
                },
              },
            }}
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
    </CollapsibleDetailPageSection>
  );
}

export default PublicationsVisualizationSection;
