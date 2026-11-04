import Card, { CardProps } from '@mui/material/Card';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { shouldForwardProp } from 'js/helpers/styled';

interface ColorVariant {
  $colorVariant?: 'primaryContainer' | 'secondaryContainer';
  $grow?: boolean;
}

const SelectableCardText = styled(Typography, { shouldForwardProp })<TypographyProps & ColorVariant>(
  ({ theme, $colorVariant }) => ({
    color: $colorVariant ? theme.palette[$colorVariant].contrastText : theme.palette.text.primary,
  }),
);

const StyledCard = styled(Card, { shouldForwardProp })<CardProps & ColorVariant>(({ theme, $grow, $colorVariant }) => ({
  minWidth: 275,
  flexGrow: $grow ? 1 : 0,
  backgroundColor: $colorVariant ? theme.palette[$colorVariant].main : theme.palette.background.paper,
  // Shadows barely show on dark surfaces, so outline the card to set it apart from the Paper it sits on.
  border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : undefined,
}));

export { SelectableCardText, StyledCard };
