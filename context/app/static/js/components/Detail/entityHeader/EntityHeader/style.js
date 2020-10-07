import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

const StyledPaper = styled(Paper)`
  position: fixed;
  width: 100%;
  top: ${headerHeight}px;
  z-index: 1000;
`;

export { StyledPaper };
