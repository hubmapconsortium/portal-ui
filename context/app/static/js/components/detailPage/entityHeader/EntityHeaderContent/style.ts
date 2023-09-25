import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import ToggleButton from '@mui/material/ToggleButton';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';

const StyledSvgIcon = styled(SvgIcon)(({ theme }) => ({
  fontSize: '1.5rem',
  color: theme.palette.primary.main,
  marginRight: theme.spacing(1),
})) as typeof SvgIcon;

const FlexContainer = styled(Container)(() => ({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
})) as typeof Container;

const FullscreenToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: 0,
  padding: `0, ${theme.spacing(1)}`,
  height: theme.spacing(4),
})) as typeof ToggleButton;

const RightDiv = styled(Box)(() => ({
  marginLeft: 'auto',
  display: 'flex',
  height: '100%',
})) as typeof Box;

export { StyledSvgIcon, FlexContainer, FullscreenToggleButton, RightDiv };
