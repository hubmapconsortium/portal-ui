import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';

// Get rid of the `::before` border pseudo-element
const StyledAccordion = styled(Accordion)`
  ::before {
    display: none;
  }
`;

export { StyledAccordion };
