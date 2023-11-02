import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const iconHeight = '1.5rem';

interface AccordionProps {
  $isExpanded: boolean;
}

const AccordionText = styled(Typography)<AccordionProps>(({ theme, $isExpanded }) => ({
  color: $isExpanded ? '#fff' : theme.palette.text.primary,
}));

const AccordionSummaryHeading = styled(AccordionText)({
  flexBasis: '20%',
  flexShrink: 0,
});

const StyledAccordionSummary = styled(AccordionSummary)<AccordionProps>(({ theme, $isExpanded }) => ({
  backgroundColor: $isExpanded ? theme.palette.secondary.main : '#E0E0E0',
  '> div': {
    minHeight: iconHeight,
  },
  // only color the expand icon
  'span > svg': {
    color: $isExpanded ? '#fff' : theme.palette.text.primary,
  },
}));

const SuccessIcon = styled(CheckCircleRoundedIcon)(({ theme }) => ({
  color: theme.palette.success.light,
  fontSize: iconHeight,
}));

export { AccordionSummaryHeading, AccordionText, StyledAccordionSummary, SuccessIcon };
