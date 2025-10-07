import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import React, { useCallback, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import PublicationVignette from 'js/components/publications/PublicationVignette';
import { StyledAccordionDetails } from './style';

const StyledAccordion = styled(Accordion)<{ $isExpanded: boolean }>(({ theme, $isExpanded }) => ({
  '& .MuiAccordionSummary-root': {
    backgroundColor: $isExpanded ? theme.palette.primary.main : '#fff',
    '& > .MuiAccordionSummary-content': {
      ...theme.typography.subtitle1,
      color: $isExpanded ? theme.palette.primary.contrastText : theme.palette.text.primary,
    },
    '& .MuiSvgIcon-root': {
      color: $isExpanded ? theme.palette.primary.contrastText : theme.palette.text.primary,
    },
  },
}));

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
        const isExpanded = i === expandedIndex;
        return (
          <StyledAccordion
            key={vignette.name}
            expanded={isExpanded}
            $isExpanded={isExpanded}
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
            <AccordionSummary expandIcon={<ArrowDropUpRoundedIcon />} data-testid={`vignette-${i}-button`}>
              {`Vignette ${i + 1}: ${vignette.name}`}
            </AccordionSummary>
            <StyledAccordionDetails data-testid={`vignette-${i}-content`}>
              <PublicationVignette
                vignette={vignette}
                uuid={uuid}
                vignetteDirName={vignette.directory_name}
                mounted={displayedVignettes[i]}
              />
            </StyledAccordionDetails>
          </StyledAccordion>
        );
      })}
    </CollapsibleDetailPageSection>
  );
}

export default PublicationsVisualizationSection;
