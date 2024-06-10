import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';

const StyledIcon = styled(SvgIcon)(({ theme }) => ({
  fontSize: '1.3rem',
  height: '25px',
  marginRight: theme.spacing(1),
}));

export { StyledIcon };
