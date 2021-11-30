import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import { iconButtonHeight } from 'js/shared-styles/buttons';

const StyledPaper = styled(Paper)`
  position: fixed;
  height: ${iconButtonHeight}px;
  width: 100%;
  top: ${headerHeight}px;
  z-index: ${(props) => props.theme.zIndex.entityHeader};
`;

export { StyledPaper };
