import { styled } from '@mui/material/styles';
import Description from 'js/shared-styles/sections/Description';

const StyledDescription = styled(Description)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export { StyledDescription };
