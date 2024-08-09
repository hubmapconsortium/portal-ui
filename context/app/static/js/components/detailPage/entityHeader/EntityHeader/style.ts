import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import { iconButtonHeight } from 'js/shared-styles/buttons';

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  height: iconButtonHeight,
  width: '100%',
  top: headerHeight,
  zIndex: theme.zIndex.entityHeader,
}));

export { StyledPaper };
