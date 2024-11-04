import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Logo from 'assets/svg/hubmap-logo.svg';

const FlexContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'top',
}));

const Flex = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(4),
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

interface FlexColumnProps {
  $mr?: boolean;
}

const FlexColumn = styled('div')<FlexColumnProps>(({ theme, $mr }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: $mr ? theme.spacing(10) : 0,
}));

const HubmapLogo = styled(Logo)(({ theme }) => ({
  height: '29px',
  fill: theme.palette.primary.main,
}));

// To account for the line height of the other text
const LogoWrapper = styled('div')({
  marginTop: '5px',
});

const Background = styled('div')(({ theme }) => ({
  background: theme.palette.white.main,
  width: '100%',
}));

export { FlexContainer, Flex, FlexColumn, HubmapLogo, LogoWrapper, Background };
