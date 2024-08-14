import Accordion from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';

export const DetailPageSectionAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'transparent',
  '& > .MuiAccordionSummary-root': {
    flexDirection: 'row-reverse',
    padding: 0,
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
