import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

interface StyledTypographyProps {
  $mt?: number;
}

const StyledTypography = styled(Typography)<StyledTypographyProps>(({ $mt = 0, theme }) => ({
  marginTop: theme.spacing($mt),
}));

export { StyledPaper, StyledTypography };
