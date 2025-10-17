import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

export const StyledChip = styled(Chip)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
  color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderColor: isSelected ? theme.palette.primary.main : theme.palette.divider,
  outline: isSelected ? '1px solid' : 'none',
  outlineColor: isSelected ? theme.palette.primary.light : 'none',
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.primary.dark : theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
  '&:focus': {
    backgroundColor: isSelected ? theme.palette.primary.dark : theme.palette.action.hover,
    color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  },
  '&:hover:focus': {
    backgroundColor: isSelected ? theme.palette.primary.dark : theme.palette.action.hover,
    color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  },
}));
