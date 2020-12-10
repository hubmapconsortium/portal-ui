import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import useSearchViewStore from 'js/stores/useSearchViewStore';
import { CenteredDiv, Flex, StyledTypography, StyledPaper, StyledInfoIcon, StyledButton } from './style';

const searchViewStoreSelector = (state) => ({
  setSearchView: state.setSearchView,
  searchView: state.searchView,
  toggleItem: state.toggleItem,
});

function DatasetSearchPrompt({ setRunTutorial }) {
  const [isDisplayed, setIsDisplayed] = useState(true);
  const [startButtonIsEnabled, setStartButtonIsEnabled] = useState(false);

  const { searchView, setSearchView, toggleItem } = useSearchViewStore(searchViewStoreSelector);

  function beginTutorial() {
    if (searchView === 'tile') {
      setSearchView('table');
      toggleItem('table');
    }
    setIsDisplayed(false);
    setRunTutorial(true);
  }

  /* TODO enable button based on whether element targeted in the first step has mounted */
  useEffect(() => {
    setTimeout(() => setStartButtonIsEnabled(true), 1000);
  }, [setStartButtonIsEnabled]);

  return isDisplayed ? (
    <StyledPaper>
      <CenteredDiv>
        <Flex>
          <StyledInfoIcon color="primary" />
          <Typography variant="subtitle1" color="textPrimary">
            Getting Started
          </Typography>
        </Flex>
        <StyledTypography>
          Welcome to the HuBMAP Data Portal. Get a quick tour of different sections of the dataset search page.
        </StyledTypography>
        <StyledButton color="primary" variant="contained" onClick={beginTutorial} disabled={!startButtonIsEnabled}>
          Take The Dataset Search Tutorial
        </StyledButton>
      </CenteredDiv>
      <div>
        <IconButton aria-label="close" onClick={() => setIsDisplayed(false)}>
          <CloseRoundedIcon />
        </IconButton>
      </div>
    </StyledPaper>
  ) : null;
}

DatasetSearchPrompt.propTypes = {
  setRunTutorial: PropTypes.func.isRequired,
};

export default DatasetSearchPrompt;
