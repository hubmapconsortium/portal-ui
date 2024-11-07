import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const PrimarySwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.primary.main,
  },
}));

export default PrimarySwitch;
