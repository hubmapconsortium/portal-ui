import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { InfoIcon } from 'js/shared-styles/icons';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';

const CenteredDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  flexGrow: 1,
  paddingLeft: theme.spacing(6) /* 48px to offset for the button size */,
  padding: theme.spacing(1),
}));

const Flex = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  display: 'flex',
  border: `1px solid ${theme.palette.info.dark}`,
}));

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
  fontSize: '1.5rem',
  color: theme.palette.info.dark,
}));

const StyledCloseIcon = styled(CloseRoundedIcon)(({ theme }) => ({
  color: theme.palette.info.dark,
}));

const StyledButton = styled(OptDisabledButton)(({ theme }) => ({
  padding: theme.spacing(0.75, 4.5),
  backgroundColor: theme.palette.info.dark,
  color: '#fff',
}));

export { CenteredDiv, Flex, StyledTypography, StyledPaper, StyledInfoIcon, StyledCloseIcon, StyledButton };
