import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface BackgroundProps {
  $isMaintenancePage?: boolean;
}

const Background = styled('div')<BackgroundProps>(({ $isMaintenancePage, theme }) => ({
  backgroundColor: $isMaintenancePage ? theme.palette.warning.main : theme.palette.error.main,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexGrow: 1,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 880,
  margin: theme.spacing(0, 2),
  padding: theme.spacing(2),
  wordBreak: 'break-all',
}));

interface StyledTypographyProps {
  $mb?: number;
}

const StyledTypography = styled(Typography)<StyledTypographyProps>(({ theme, $mb = 0 }) => ({
  marginBottom: theme.spacing($mb),
}));

export { Background, StyledPaper, StyledTypography };
