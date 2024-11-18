import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const PrimarySwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.primary.lowEmphasis,
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.secondary.main,
    transition: theme.transitions.create(['background-color'], {
      duration: theme.transitions.duration.short,
    }),
  },
  '& .Mui-checked .MuiSwitch-thumb': {
    backgroundColor: theme.palette.primary.main,
  },
}));

export default PrimarySwitch;
