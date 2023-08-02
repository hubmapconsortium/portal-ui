import styled, { css } from 'styled-components';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import { entityHeaderHeight } from 'js/components/detailPage/entityHeader/EntityHeader';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';

const totalHeightOffset = headerHeight + entityHeaderHeight;

const vitessceFixedHeight = 600;

const StyledHeader = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(1)};
  display: flex;
`;

const StyledSectionHeader = styled(SectionHeader)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)};
`;

const Flex = styled.div`
  display: flex;
`;

const ExpandButton = styled(WhiteBackgroundIconButton)`
  margin-left: 0.5rem;
`;

const SelectionButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing(1)};
  color: white;
  border-radius: 3px;
`;

const VitessceInfoSnackbar = styled(Snackbar)`
  top: ${totalHeightOffset + 10}px;
  & > div {
    background-color: ${(props) =>
      props.$isWarning ? props.theme.palette.warning.main : 'dimgray'}; // TODO: Move to theme.
    color: ${(props) => (props.$isWarning ? '#000000' : props.theme.palette.white.main)}; // TODO: Move to theme.
  }
`;

const ErrorSnackbar = styled(Snackbar)`
  position: absolute;
  background-color: ${(props) => props.theme.palette.white.main};
`;

const ExpandableDiv = styled.div`
  top: ${(props) => (props.$isExpanded ? `${totalHeightOffset}px` : 'auto')};
  left: ${(props) => (props.$isExpanded ? '0' : 'auto')};
  position: ${(props) => (props.$isExpanded ? 'fixed' : 'relative')};
  height: ${(props) => (props.$isExpanded ? `calc(100vh - ${totalHeightOffset}px)` : `${vitessceFixedHeight}px`)};
  background-color: ${(props) =>
    props.$theme === 'dark' ? '#333333' : props.theme.palette.white.main}; // TODO: Move to theme.
  width: 100%;
  overflow: visible;
  .vitessce-container {
    display: block;
    height: ${(props) => (props.$isExpanded ? `calc(100vh - ${totalHeightOffset}px)` : 'auto')};
    width: 100%;
    position: static;
  }
`;

const StyledDetailPageSection = styled(DetailPageSection)`
  width: 100%;
  ${(props) =>
    props.$vizIsFullscreen &&
    css`
      z-index: ${props.theme.zIndex.visualization};
      position: relative;
    `};
`;

const bodyExpandedCSS = css`
  body {
    overflow: hidden;
  }
`;

export {
  vitessceFixedHeight,
  bodyExpandedCSS,
  StyledHeader,
  StyledSectionHeader,
  Flex,
  ExpandButton,
  ErrorSnackbar,
  VitessceInfoSnackbar,
  ExpandableDiv,
  SelectionButton,
  StyledDetailPageSection,
};
