import { styled } from '@mui/material/styles';
import { InfoIcon } from 'js/shared-styles/icons';

const StyledIconDiv = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(0.25),
}));

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '0.75rem',
}));

export { StyledIconDiv, StyledInfoIcon };
