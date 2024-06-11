import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';

const FooterIcon = styled(SvgIcon)(({ theme }) => ({
  fontSize: '0.9rem',
  height: '18px',
  marginRight: theme.spacing(1),
}));

export { FooterIcon };
