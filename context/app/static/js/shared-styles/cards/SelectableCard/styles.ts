import Card, { CardProps } from '@mui/material/Card';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface ColorVariant {
  $colorVariant?: 'primaryContainer' | 'secondaryContainer';
  $grow?: boolean;
}

const SelectableCardText = styled(Typography)<TypographyProps & ColorVariant>(({ theme, $colorVariant }) => ({
  color: $colorVariant ? theme.palette[$colorVariant].contrastText : theme.palette.text.primary,
}));

const StyledCard = styled(Card)<CardProps & ColorVariant>(({ theme, $grow, $colorVariant }) => ({
  minWidth: 275,
  flexGrow: $grow ? 1 : 0,
  backgroundColor: $colorVariant ? theme.palette[$colorVariant].main : theme.palette.background.paper,
}));

export { SelectableCardText, StyledCard };
