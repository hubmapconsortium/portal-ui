import React, { useState, useEffect } from 'react';
import { Vitessce } from 'vitessce';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import VisualizationThemeSwitch from '../VisualizationThemeSwitch';
import {
  vitessceFixedHeight,
  bodyExpandedCSS,
  StyledSectionContainer,
  StyledHeader,
  StyledHeaderText,
  StyledHeaderRight,
  ExpandButton,
  TopSnackbar,
  ExpandableDiv,
  StyledFooterText,
} from './style';
import 'vitessce/dist/es/production/static/css/index.css';

function Visualization(props) {
  const { vitData } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [vitessceTheme, setVitessceTheme] = useState('light');

  function handleExpand() {
    setIsExpanded(true);
    setIsSnackbarOpen(true);
  }

  function handleCollapse() {
    setIsExpanded(false);
    setIsSnackbarOpen(false);
  }

  function handleThemeChange(e) {
    if (e.target.checked) {
      setVitessceTheme('dark');
    } else {
      setVitessceTheme('light');
    }
  }

  useEffect(() => {
    function onKeydown(event) {
      if (event.key === 'Escape') {
        handleCollapse();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, []);

  return (
    <StyledSectionContainer id="visualization">
      <StyledHeader>
        <StyledHeaderText variant="h3" component="h2">
          Visualization
        </StyledHeaderText>
        <StyledHeaderRight>
          <VisualizationThemeSwitch theme={vitessceTheme} onChange={handleThemeChange} />
          <ExpandButton onClick={handleExpand}>
            <ZoomOutMapIcon />
          </ExpandButton>
        </StyledHeaderRight>
      </StyledHeader>
      <Paper>
        <ExpandableDiv $isExpanded={isExpanded} $theme={vitessceTheme}>
          <TopSnackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={isSnackbarOpen}
            autoHideDuration={4000}
            onClose={() => setIsSnackbarOpen(false)}
            message="Press [esc] to exit full window."
          />
          <Vitessce config={vitData} theme={vitessceTheme} height={isExpanded ? null : vitessceFixedHeight} />
        </ExpandableDiv>
      </Paper>
      <StyledFooterText variant="body2">
        Powered by&nbsp;
        <Link href="http://vitessce.io" target="_blank" rel="noreferrer">
          Vitessce
        </Link>
      </StyledFooterText>
      <style type="text/css">{isExpanded ? bodyExpandedCSS : null}</style>
    </StyledSectionContainer>
  );
}

export default Visualization;
