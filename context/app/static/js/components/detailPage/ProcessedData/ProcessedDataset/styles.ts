import Accordion from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';

export const StyledSubsectionAccordion = styled(Accordion)(({ theme }) => ({
  '& .MuiAccordionSummary-root': {
    flexDirection: 'row-reverse',
    backgroundColor: theme.palette.common.white,
    // margin: theme.spacing(2),
    '& .MuiAccordionSummary-content': {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 0,
      color: theme.palette.primary.main,
      '&.Mui-expanded': {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.main,
      },
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      marginLeft: theme.spacing(1),
      color: theme.palette.primary.main,
      '&.Mui-expanded': {
        color: theme.palette.primary.main,
      },
    },
    '&.Mui-expanded': {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.main,
    },
  },
}));
