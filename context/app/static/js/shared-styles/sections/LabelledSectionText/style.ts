import { styled } from '@mui/material/styles';
import { InfoIcon } from 'js/shared-styles/icons';
import Stack from '@mui/material/Stack';

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  fontSize: '1.5rem',
}));

const TextContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'bottomSpacing',
})<{ $bottomSpacing?: number }>`
  ${(props) => props.$bottomSpacing && `margin-bottom: ${props.theme.spacing(props.$bottomSpacing)}`};
`;

export { StyledInfoIcon, TextContainer };
