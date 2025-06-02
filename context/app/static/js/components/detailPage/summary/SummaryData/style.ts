import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';

const FlexEnd = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const StyledSvgIcon = styled(SvgIcon)({
  fontSize: '1rem',
});

export { FlexEnd, StyledSvgIcon };
