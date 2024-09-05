import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 450,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.info.dark,
}));

const Flex = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

const FlexEnd = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
});

const WhiteTypography = styled(Typography)({
  color: '#fff',
});

const WhiteCloseRoundedIcon = styled(CloseRoundedIcon)({
  color: '#fff',
});

export { StyledPaper, Flex, FlexEnd, WhiteTypography, WhiteCloseRoundedIcon };
