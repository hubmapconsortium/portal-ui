import SvgIcon from '@mui/material/SvgIcon';
import Accordion from '@mui/material/Accordion';
import Box from '@mui/material/Box';
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

  '.accordion-section-action': {
    opacity: 0,
    transition: 'opacity 0.3s',
    pointerEvents: 'none',
  },
  '&.Mui-expanded': {
    '.accordion-section-action': {
      opacity: 1,
      pointerEvents: 'auto',
    },
  },
}));

export const StyledExternalImageIconContainer = styled(Box)({
  width: '1.5rem',
  display: 'flex',
  '& > *': {
    width: '100%',
    height: '100%',
  },
});

export const StyledSvgIcon = styled(SvgIcon)({
  fontSize: '1.5rem',
  color: 'primary',
}) as typeof SvgIcon;
