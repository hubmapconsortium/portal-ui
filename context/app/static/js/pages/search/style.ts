import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

const SearchHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledSvgIcon = styled(SvgIcon)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
  fontSize: '2.5rem',
}));

const SearchEntityHeader = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
}));

export { SearchHeader, StyledSvgIcon, SearchEntityHeader };
