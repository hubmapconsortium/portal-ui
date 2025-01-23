import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import { initialEntityHeaderHeight } from 'js/components/detailPage/entityHeader/EntityHeader';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import DetailPageSection from 'js/components/detailPage/DetailPageSection';

const totalHeightOffset = headerHeight + initialEntityHeaderHeight;

const vitessceFixedHeight = 600;

const StyledHeader = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(1),
  display: 'flex',
}));

const StyledSectionHeader = styled(SectionHeader)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

const ExpandButton = styled(WhiteBackgroundIconButton)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const SelectionButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: 'white',
  borderRadius: '3px',
}));

interface ExpandableDivProps {
  $isExpanded: boolean;
  $theme: 'dark' | 'light';
  $nonExpandedHeight?: number;
}

const ExpandableDiv = styled('div')<ExpandableDivProps>(
  ({ $isExpanded, theme, $theme, $nonExpandedHeight = vitessceFixedHeight }) => ({
    top: $isExpanded ? `${totalHeightOffset}px` : 'auto',
    left: $isExpanded ? '0' : 'auto',
    position: $isExpanded ? 'fixed' : 'relative',
    height: $isExpanded ? `calc(100vh - ${totalHeightOffset}px)` : `${$nonExpandedHeight}px`,
    backgroundColor: $theme === 'dark' ? '#333333' : theme.palette.white.main,
    width: '100%',
    overflow: 'scroll',
    '.vitessce-container': {
      display: 'block',
      height: $isExpanded ? `calc(100vh - ${totalHeightOffset}px)` : 'auto',
      width: '100%',
      position: 'static',
    },
  }),
);

interface StyledDetailPageSectionProps {
  $vizIsFullscreen: boolean;
}

const StyledDetailPageSection = styled(DetailPageSection)<StyledDetailPageSectionProps>(
  ({ theme, $vizIsFullscreen }) => ({
    width: '100%',
    zIndex: $vizIsFullscreen ? theme.zIndex.visualization : 'auto',
    position: $vizIsFullscreen ? 'relative' : 'static',
  }),
);

const bodyExpandedCSS = `
  body {
    overflow: hidden;
  }
`;

export {
  vitessceFixedHeight,
  bodyExpandedCSS,
  StyledHeader,
  StyledSectionHeader,
  ExpandButton,
  ExpandableDiv,
  SelectionButton,
  StyledDetailPageSection,
};
