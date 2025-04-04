import Switch from '@mui/material/Switch';
import { styled, Theme } from '@mui/material/styles';

const transition = (theme: Theme) =>
  theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.short,
  });

const PrimarySwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.primary.lowEmphasis,
    transition: transition(theme),
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.secondary.main,
    transition: transition(theme),
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    '& + .MuiSwitch-track': {
      backgroundColor: theme.palette.success.main,
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.success.main,
    },
  },
})) as typeof Switch;

export default PrimarySwitch;
