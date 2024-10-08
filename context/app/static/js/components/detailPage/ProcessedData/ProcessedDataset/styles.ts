import Accordion from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';

export const StyledSubsectionAccordion = styled(Accordion)(({ theme }) => ({
  '& > .MuiAccordionSummary-root': {
    flexDirection: 'row-reverse',
    backgroundColor: theme.palette.common.white,
    '& > .MuiAccordionSummary-content': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      color: theme.palette.primary.main,
    },
    '& > .MuiAccordionSummary-expandIconWrapper': {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
    },
  },
}));
