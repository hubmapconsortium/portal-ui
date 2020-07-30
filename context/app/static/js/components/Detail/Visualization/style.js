import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import SectionContainer from '../SectionContainer';
import SectionHeader from '../SectionHeader';

const headerFixedHeight = 64;
const vitessceFixedHeight = 600;

const StyledHeader = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

const StyledHeaderText = styled(SectionHeader)`
  margin-bottom: 0;
  display: inline-block;
`;

const StyledHeaderRight = styled.div`
  float: right;
  display: flex;
`;

const StyledSectionContainer = styled(SectionContainer)`
  z-index: 3;
  position: relative;
`;

const ExpandButton = styled(Button)`
  display: inline-block;
  background-color: #ffffff;
  margin-left: 0.5rem;
  svg {
    vertical-align: middle;
  }
`;

const SelectionButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
  color: white;
`;

const EscSnackbar = styled(Snackbar)`
  top: ${headerFixedHeight + 10}px;
  & > div {
    background-color: dimgray;
  }
`;

const ErrorSnackbar = styled(Snackbar)`
  position: absolute;
`;

const ExpandableDiv = styled.div`
  top: ${(props) => (props.$isExpanded ? `${headerFixedHeight}px` : 'auto')};
  left: ${(props) => (props.$isExpanded ? '0' : 'auto')};
  position: ${(props) => (props.$isExpanded ? 'fixed' : 'relative')};
  height: ${(props) => (props.$isExpanded ? `calc(100vh - ${headerFixedHeight}px)` : `${vitessceFixedHeight}px`)};
  background-color: ${(props) => (props.$theme === 'dark' ? '#333333' : '#FFFFFF')};
  width: 100%;
  overflow: hidden;
  .vitessce-container {
    display: block;
    height: ${(props) => (props.$isExpanded ? `calc(100vh - ${headerFixedHeight}px)` : 'auto')};
    width: 100%;
    position: static;
  }
`;

const StyledFooterText = styled(Typography)`
  line-height: 1.5;
  text-align: right;
`;

const bodyExpandedCSS = `
  body {
    overflow: hidden;
  }
`;

export {
  vitessceFixedHeight,
  bodyExpandedCSS,
  StyledSectionContainer,
  StyledHeader,
  StyledHeaderText,
  StyledHeaderRight,
  ExpandButton,
  EscSnackbar,
  ErrorSnackbar,
  ExpandableDiv,
  StyledFooterText,
  SelectionButton,
};
