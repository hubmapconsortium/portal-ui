import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import Paper from '@mui/material/Paper';

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(3),
}));

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

export { StyledPaper, StyledInfoIcon };
