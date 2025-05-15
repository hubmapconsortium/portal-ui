import { styled } from '@mui/material/styles';

const ChartWrapper = styled('div')(({ theme }) => ({
  height: '350px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(1.5),
}));

export { ChartWrapper };
