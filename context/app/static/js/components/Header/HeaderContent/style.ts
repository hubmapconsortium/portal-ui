import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';

const Spacer = styled('div')({
  flexGrow: 1,
});

const HeaderButton = styled(Button)({
  color: 'white',
});

const FlexNoWrap = styled('div')({
  display: 'flex',
  flexWrap: 'nowrap',
});

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(0.5, 0),
}));

const StyledSvgIcon = styled(SvgIcon)({
  fontSize: '1.25rem',
});

export { Spacer, HeaderButton, FlexNoWrap, StyledDivider, StyledSvgIcon };
