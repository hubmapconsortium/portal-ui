import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import Joyride, { ACTIONS, LIFECYCLE } from 'react-joyride';

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
      lifecycle,
      step: { title },
    } = data;

    if (action === ACTIONS.START && title === 'Select a Query Type') {
      setQueryType(queryTypes.gene.value);
    }

    if (action === ACTIONS.NEXT && lifecycle === LIFECYCLE.COMPLETE && title === 'Select a Query Type') {
      setParametersButtonRef.current.click();
      setCellVariableNames(['UMOD']);
    }

    if (action === ACTIONS.NEXT && lifecycle === LIFECYCLE.COMPLETE && title === 'Fill in Parameters') {
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
        disableOverlayClose
        floaterProps={{
          disableAnimation: true,
        }}
        tooltipComponent={TutorialTooltip}
        styles={{
          options: {
            arrowColor: themeContext.palette.info.dark,
            zIndex: themeContext.zIndex.tutorial,
            overlayColor: 'rgba(0, 0, 0, 0)',
          },
        }}
        stepIndex={tutorialStep}
      />
    </>
  );
}

export default withTutorialProvider(CellsTutorial, 'has_exited_cells_tutorial');
