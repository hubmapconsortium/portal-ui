import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  top: headerHeight,
  zIndex: theme.zIndex.entityHeader,
}));

export { StyledPaper };
