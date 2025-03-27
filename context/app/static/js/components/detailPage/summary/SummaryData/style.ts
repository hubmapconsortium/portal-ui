import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

const FlexEnd = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

const StyledSvgIcon = styled(SvgIcon)({
  fontSize: '1rem',
});

export { FlexEnd, StyledTypography, StyledSvgIcon };
