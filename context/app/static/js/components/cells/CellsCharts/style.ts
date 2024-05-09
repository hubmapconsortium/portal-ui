import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const PaddedDiv = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
}));

const StyledTypography = styled(Typography)({
  margin: '0px 10px',
});

const ChartWrapper = styled('div')(({ theme }) => ({
  height: '350px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(1.5),
}));

export { PaddedDiv, ChartWrapper, StyledTypography };
