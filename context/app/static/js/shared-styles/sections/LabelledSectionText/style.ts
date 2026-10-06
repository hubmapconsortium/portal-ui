import { styled } from '@mui/material/styles';
import { InfoIcon } from 'js/shared-styles/icons';
import Stack from '@mui/material/Stack';
import { shouldForwardProp } from 'js/helpers/styled';

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  fontSize: '1.5rem',
}));

// The transient prop is `$bottomSpacing`; the old filter named `bottomSpacing`, which this
// component never receives, so `$bottomSpacing` reached the DOM and React rejected it as an
// invalid attribute name.
const TextContainer = styled(Stack, { shouldForwardProp })<{ $bottomSpacing?: number }>(
  ({ theme, $bottomSpacing }) => ({
    marginBottom: $bottomSpacing ? theme.spacing($bottomSpacing) : undefined,
  }),
);

export { StyledInfoIcon, TextContainer };
