import { styled } from '@mui/material/styles';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledExpandMoreIcon = styled(ExpandMoreIcon)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.secondary.main,
}));

export { StyledExpandMoreIcon };
