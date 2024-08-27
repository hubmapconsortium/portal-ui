import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Accordion from '@mui/material/Accordion';

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.primary.main,
  },
}));

// Get rid of the `::before` border pseudo-element
const StyledAccordion = styled(Accordion)`
  ::before {
    display: none;
  }
`;

export { StyledSwitch, StyledAccordion };
