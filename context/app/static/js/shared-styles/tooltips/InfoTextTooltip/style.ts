import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { InfoIcon } from 'js/shared-styles/icons';

const StyledOuterStack = styled(Stack)({
  alignItems: 'center',
  flexDirection: 'row',
});

const StyledInnerStack = styled(Stack)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  justifyContent: 'center',
}));

const StyledInfoIcon = styled(InfoIcon)(({ theme, fontSize = '0.75rem' }) => ({
  color: theme.palette.primary.main,
  fontSize,
}));

export { StyledOuterStack, StyledInnerStack, StyledInfoIcon };
