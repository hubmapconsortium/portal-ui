import React, { useState, useEffect } from 'react';
import { Vitessce } from 'vitessce';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import SectionHeader from '../SectionHeader';
import {
  vitessceFixedHeight,
  StyledSectionContainer,
  ExpandButton,
  TopSnackbar,
  ExpandableDiv,
  FlexContainer,
  FlexBottomRight,
  StyledFooterText,
} from './style';
import 'vitessce/dist/es/production/static/css/index.css';

function Visualization(props) {
  const { vitData } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  function handleExpand() {
    setIsExpanded(true);
    setIsSnackbarOpen(true);
  }

  function handleCollapse() {
    setIsExpanded(false);
    setIsSnackbarOpen(false);
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
      <SectionHeader variant="h3" component="h2">
        Visualization
        <ExpandButton onClick={handleExpand}>
          <ZoomOutMapIcon />
        </ExpandButton>
      </SectionHeader>
      <Paper>
        <ExpandableDiv $isExpanded={isExpanded}>
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
          <Vitessce config={vitData} theme="light" height={isExpanded ? null : vitessceFixedHeight} />
        </ExpandableDiv>
      </Paper>
      <FlexContainer>
        <FlexBottomRight>
          <StyledFooterText variant="body2">
            Powered by&nbsp;
            <Link href="http://vitessce.io" target="_blank">
              Vitessce
            </Link>
          </StyledFooterText>
        </FlexBottomRight>
      </FlexContainer>
    </StyledSectionContainer>
  );
}

export default Visualization;
