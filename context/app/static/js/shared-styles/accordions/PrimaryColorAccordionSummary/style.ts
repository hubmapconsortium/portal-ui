import { styled } from '@mui/material/styles';

import AccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';

interface PrimaryColorAccordionSummaryProps extends AccordionSummaryProps {
  $isExpanded?: boolean;
}

const PrimaryColorAccordionSummary = styled(AccordionSummary)<PrimaryColorAccordionSummaryProps>(({
  $isExpanded,
  theme,
}) => {
  const backgroundColor = $isExpanded ? theme.palette.primary.main : '#fff';
  return {
    backgroundColor,
    '& div > *': { color: $isExpanded ? '#fff' : theme.palette.text.primary },
    '&.MuiAccordionSummary-root': { backgroundColor },
  };
});

export { PrimaryColorAccordionSummary };
