import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SectionContainer from '../SectionContainer';

const headerFixedHeight = 64;
const vitessceFixedHeight = 600;

const StyledSectionContainer = styled(SectionContainer)`
  z-index: 3;
`;

const ExpandButton = styled(Button)`
  float: right;
`;

const TopSnackbar = styled(Snackbar)`
  top: ${headerFixedHeight + 10}px;
`;

const ExpandableDiv = styled.div`
  top: ${(props) => (props.$isExpanded ? `${headerFixedHeight}px` : 'auto')};
  left: ${(props) => (props.$isExpanded ? '0' : 'auto')};
  position: ${(props) => (props.$isExpanded ? 'fixed' : 'relative')};
  height: ${(props) => (props.$isExpanded ? `calc(100vh - ${headerFixedHeight}px)` : `${vitessceFixedHeight}px`)};
  width: 100%;
  overflow-y: hidden;
  .vitessce-container {
    display: block;
    height: ${(props) => (props.$isExpanded ? `calc(100vh - ${headerFixedHeight}px)` : 'auto')};
    width: 100%;
  }
`;

const FlexContainer = styled.div`
  display: flex;
`;

const FlexRight = styled.div`
  display: flex;
  margin-left: auto;
`;

const FlexBottomRight = styled(FlexRight)`
  align-items: flex-end;
`;

const StyledFooterText = styled.p`
  line-height: 1.5;
  font-size: 0.75rem;
  margin: 0;

  > a {
    font-size: 0.75rem;
  }
`;

export {
  headerFixedHeight,
  vitessceFixedHeight,
  StyledSectionContainer,
  ExpandButton,
  TopSnackbar,
  ExpandableDiv,
  FlexContainer,
  FlexBottomRight,
  StyledFooterText,
};
