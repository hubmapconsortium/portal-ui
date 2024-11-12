import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';

const PrimaryColorAccordion = styled(Accordion)(({ theme }) => ({
  '& .MuiAccordionSummary-root': {
    backgroundColor: theme.palette.secondaryContainer.main,
    '& .MuiAccordionSummary-content': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      color: theme.palette.primary.main,
      '&.Mui-expanded': {
        color: theme.palette.common.white,
      },
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
      '&.Mui-expanded': {
        color: theme.palette.common.white,
      },
    },
    '&.Mui-expanded': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export { PrimaryColorAccordion };
