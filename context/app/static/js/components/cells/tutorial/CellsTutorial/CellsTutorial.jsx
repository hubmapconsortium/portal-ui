import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import Joyride, { ACTIONS } from 'react-joyride';

import TutorialTooltip from 'js/shared-styles/tutorials/TutorialTooltip';
import Prompt from 'js/shared-styles/tutorials/Prompt';
import { withTutorialProvider } from 'js/shared-styles/tutorials/TutorialProvider';
import { queryTypes } from 'js/components/cells/queryTypes';
import { useStore as useCellsStore } from 'js/components/cells/store';
import { useStore as useTutorialStore } from 'js/shared-styles/tutorials/TutorialProvider/store';

import { steps } from './config';

const cellsStoreSelector = (state) => ({
  setQueryType: state.setQueryType,
  setCellVariableNames: state.setCellVariableNames,
});

function CellsTutorial({ setParametersButtonRef, runQueryButtonRef }) {
  const themeContext = useContext(ThemeContext);
  const { setQueryType, setCellVariableNames } = useCellsStore(cellsStoreSelector);
  const { tutorialStep, tutorialIsRunning, runTutorial } = useTutorialStore();

  const handleJoyrideCallback = (data) => {
    const {
      action,
      step: { title },
    } = data;

    if (action === ACTIONS.NEXT && title === 'Fill in Parameters') {
      setQueryType(queryTypes.gene.value);
      setParametersButtonRef.current.click();
    }

    if (action === ACTIONS.NEXT && title === 'View Results') {
      setCellVariableNames(['UMOD']);
      runQueryButtonRef.current.click();
    }
  };

  return (
    <>
      <Prompt
        headerText="Getting Started"
        descriptionText="Get a tutorial of how to explore the genomic and proteomic information in the HuBMAP data portal."
        buttonText="Take the Molecular Data Queries Tutorial"
        buttonOnClick={runTutorial}
        buttonIsDisabled={false}
        closeOnClick={() => {}}
      />
      <Joyride
        steps={steps}
        callback={handleJoyrideCallback}
        run={tutorialIsRunning}
        scrollOffset={100}
        floaterProps={{
          disableAnimation: true,
        }}
        tooltipComponent={TutorialTooltip}
        styles={{ options: { arrowColor: themeContext.palette.info.dark, zIndex: themeContext.zIndex.tutorial } }}
        stepIndex={tutorialStep}
      />
    </>
  );
}

export default withTutorialProvider(CellsTutorial, 'has_exited_cells_tutorial');
