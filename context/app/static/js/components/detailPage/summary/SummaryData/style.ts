import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

const FlexEnd = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

const StyledSvgIcon = styled(SvgIcon)(({ theme }) => ({
  fontSize: '1.25rem',
  marginRight: theme.spacing(0.5),
}));

const SummaryDataHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

export { FlexEnd, StyledTypography, StyledSvgIcon, SummaryDataHeader };
