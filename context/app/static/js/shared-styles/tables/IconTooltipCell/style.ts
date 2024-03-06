import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';

const Flex = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const StyledSvgIcon = styled(SvgIcon)((props) => ({
  marginLeft: props.theme.spacing(0.5),
}));

export { Flex, StyledSvgIcon };
