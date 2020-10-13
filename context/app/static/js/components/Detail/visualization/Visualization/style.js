import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import SectionContainer from 'js/components/Detail/SectionContainer';
import SectionHeader from 'js/components/Detail/SectionHeader';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import { entityHeaderHeight } from 'js/components/Detail/entityHeader/EntityHeader';

const totalHeightOffset = window.location.pathname.startsWith('/preview')
  ? headerHeight
  : headerHeight + entityHeaderHeight;

const vitessceFixedHeight = 600;

const StyledHeader = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
  display: flex;
`;

const StyledHeaderText = styled(SectionHeader)`
  margin-bottom: 0;
  display: inline-block;
`;

const StyledHeaderRight = styled.div`
  margin-left: auto;
  display: flex;
`;

const StyledSectionContainer = styled(SectionContainer)`
  z-index: 3;
  position: relative;
`;

const ExpandButton = styled(WhiteBackgroundIconButton)`
  margin-left: 0.5rem;
`;

const SelectionButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
  color: white;
`;

const EscSnackbar = styled(Snackbar)`
  top: ${totalHeightOffset + 10}px;
  & > div {
    background-color: dimgray;
  }
`;

const ErrorSnackbar = styled(Snackbar)`
  position: absolute;
`;

const ExpandableDiv = styled.div`
  top: ${(props) => (props.$isExpanded ? `${totalHeightOffset}px` : 'auto')};
  left: ${(props) => (props.$isExpanded ? '0' : 'auto')};
  position: ${(props) => (props.$isExpanded ? 'fixed' : 'relative')};
  height: ${(props) => (props.$isExpanded ? `calc(100vh - ${totalHeightOffset}px)` : `${vitessceFixedHeight}px`)};
  background-color: ${(props) => (props.$theme === 'dark' ? '#333333' : '#FFFFFF')};
  width: 100%;
  overflow: hidden;
  .vitessce-container {
    display: block;
    height: ${(props) => (props.$isExpanded ? `calc(100vh - ${totalHeightOffset}px)` : 'auto')};
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
