import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';

const StyledSubtitle1 = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
  color: theme.palette.text.primary,
}));

const StyledSubtitle2 = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.primary,
}));

// Get rid of the `::before` border pseudo-element
const StyledAccordion = styled(Accordion)`
  ::before {
    display: none;
  }
`;

export { StyledSubtitle1, StyledSubtitle2, StyledAccordion };
