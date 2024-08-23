import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const StyledPaper = styled(Paper)({
  padding: '30px 40px 30px 40px',
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const maxGraphHeight = 500;
const StyledDiv = styled('div')({
  '&.scroll-container-wrapper': {
    maxHeight: maxGraphHeight,
  },
});

export { StyledPaper, StyledTypography, StyledDiv, maxGraphHeight };
