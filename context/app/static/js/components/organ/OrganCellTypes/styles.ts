import { styled } from '@mui/material/styles';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';

export const StyledDetailsAccordion = styled(DetailsAccordion)({
  '& .MuiAccordionSummary-root': {
    flexDirection: 'row',
    justifyContent: 'start',
  },
  '& .MuiAccordionDetails-root': {
    padding: 0,
    spacing: 2,
  },
});
