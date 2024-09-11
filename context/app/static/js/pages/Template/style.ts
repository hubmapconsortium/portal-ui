import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

const StyledButton = styled(Button)({
  alignSelf: 'flex-end',
});

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '.5rem',
  borderColor: theme.palette.grey[200],
}));

export { StyledChip, StyledButton };
