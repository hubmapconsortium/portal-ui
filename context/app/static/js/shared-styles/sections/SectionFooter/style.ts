import { styled } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

import Typography from '@mui/material/Typography';

const StyledTypography = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
});

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  backgroundColor: theme.palette.primary.main,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  padding: theme.spacing(0, 2),
  backgroundColor: theme.palette.caption.background,
  minHeight: theme.spacing(3),
  borderRadius: theme.spacing(0, 0, 0.5, 0.5),
}));

export { StyledDivider, StyledPaper, StyledTypography };
