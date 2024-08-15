import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const StyledSubtitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.primary,
}));

export { StyledAccordion, StyledSubtitle };
