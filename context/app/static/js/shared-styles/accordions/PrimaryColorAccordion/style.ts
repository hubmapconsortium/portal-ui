import { alpha, styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';

// When `$retracted` is set, the summary uses a muted tint of the retracted background with dark
// content (in both collapsed and expanded states) for processed datasets of a retracted dataset.
const PrimaryColorAccordion = styled(Accordion, {
  shouldForwardProp: (prop) => prop !== '$retracted',
})<{ $retracted?: boolean }>(({ theme, $retracted }) => ({
  '& .MuiAccordionSummary-root': {
    backgroundColor: $retracted
      ? alpha(theme.palette.retractedBackground.main, 0.2)
      : theme.palette.secondaryContainer.main,
    flexDirection: 'row',
    '& .MuiAccordionSummary-content': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      margin: theme.spacing(2),
      color: theme.palette.primary.main,
      '&.Mui-expanded': {
        color: $retracted ? theme.palette.primary.main : theme.palette.common.white,
      },
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      marginRight: theme.spacing(2),
      color: theme.palette.primary.main,
      '&.Mui-expanded': {
        color: $retracted ? theme.palette.primary.main : theme.palette.common.white,
      },
    },
    '&.Mui-expanded': {
      backgroundColor: $retracted ? alpha(theme.palette.retractedBackground.main, 0.2) : theme.palette.primary.main,
    },
  },
}));

export { PrimaryColorAccordion };
