import Accordion from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';

export const ProcessedDatasetSectionAccordion = styled(Accordion)(({ theme }) => ({
  '& > .MuiAccordionSummary-root': {
    backgroundColor: theme.palette.secondaryContainer.main,
    '& > .MuiAccordionSummary-content': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      color: theme.palette.primary.main,
      '&.Mui-expanded': {
        color: theme.palette.common.white,
      },
    },
    '& > .MuiAccordionSummary-expandIconWrapper': {
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
  scrollMarginTop: theme.spacing(12),
}));

export const SubsectionAccordion = styled(Accordion)(({ theme }) => ({
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
  scrollMarginTop: theme.spacing(12),
}));
