import { styled } from '@mui/material/styles';
import HeaderIcon from 'js/shared-styles/icons/HeaderIcon';

const StyledHeaderIcon = styled(HeaderIcon)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
}));

export { StyledHeaderIcon };
