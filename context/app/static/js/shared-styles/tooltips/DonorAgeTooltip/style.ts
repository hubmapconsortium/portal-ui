import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { InfoIcon } from 'js/shared-styles/icons';

const StyledStack = styled(Stack)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  justifyContent: 'center',
}));

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '0.75rem',
}));

export { StyledStack, StyledInfoIcon };
