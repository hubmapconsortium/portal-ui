import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const StyledButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey[300],
  borderRadius: theme.spacing(0.5),
}));

export { StyledButton };
