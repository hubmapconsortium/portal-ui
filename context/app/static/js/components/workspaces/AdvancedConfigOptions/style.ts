import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import { Switch } from '@mui/material';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

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

export { StyledAccordion, StyledSubtitle, StyledSwitch, StyledHeader, StyledSwitchLabel };
