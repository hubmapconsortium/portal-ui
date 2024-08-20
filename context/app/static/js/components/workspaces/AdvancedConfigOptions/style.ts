import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Accordion from '@mui/material/Accordion';

const StyledSubtitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.primary,
}));

const StyledHeader = styled(StyledSubtitle)({
  fontSize: '1rem',
});

const StyledSwitchLabel = styled(Typography)({
  fontSize: '.75rem',
});

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

export { StyledSubtitle, StyledSwitch, StyledHeader, StyledSwitchLabel, StyledAccordion };
