import Card, { CardProps } from '@mui/material/Card';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface ColorVariant {
  $colorVariant: 'primaryContainer' | 'secondaryContainer';
}

const SelectableCardText = styled(Typography)<TypographyProps & ColorVariant>(({ theme, $colorVariant }) => ({
  color: theme.palette[$colorVariant].contrastText,
}));

const StyledCard = styled(Card)<CardProps & ColorVariant>(({ theme, $colorVariant }) => ({
  minWidth: 275,
  backgroundColor: theme.palette[$colorVariant].main,
}));

export { SelectableCardText, StyledCard };
