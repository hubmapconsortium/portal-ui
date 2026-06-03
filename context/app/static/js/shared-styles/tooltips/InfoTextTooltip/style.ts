import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { InfoIcon } from 'js/shared-styles/icons';

// Rendered as <span> with inline-flex so InfoTextTooltip can be placed inside
// a Typography <p> without producing invalid HTML.
const StyledOuterStack = styled(Stack)({
  display: 'inline-flex',
  alignItems: 'center',
  flexDirection: 'row',
});

const StyledInnerStack = styled(Stack)(({ theme }) => ({
  display: 'inline-flex',
  marginLeft: theme.spacing(0.5),
  justifyContent: 'center',
}));

const StyledInfoIcon = styled(InfoIcon)(({ theme, fontSize = '0.75rem' }) => ({
  color: theme.palette.primary.main,
  fontSize,
}));

export { StyledOuterStack, StyledInnerStack, StyledInfoIcon };
