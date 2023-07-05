import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import Joyride, { ACTIONS, LIFECYCLE } from 'react-joyride';

import TutorialTooltip from 'js/shared-styles/tutorials/TutorialTooltip';
import Prompt from 'js/shared-styles/tutorials/Prompt';
import { queryTypes } from 'js/components/cells/queryTypes';
import { useStore as useCellsStore } from 'js/components/cells/store';
import { useStore as useTutorialStore } from 'js/shared-styles/tutorials/TutorialProvider/store';
import { useStore as useAccordionStepsStore } from 'js/shared-styles/accordions/AccordionSteps/store';

import { steps } from './config';

const cellsStoreSelector = (state) => ({
  setQueryType: state.setQueryType,
  setSelectedQueryType: state.setSelectedQueryType,
  setCellVariableNames: state.setCellVariableNames,
  resetStore: state.resetStore,
});

function CellsTutorial({ setParametersButtonRef, runQueryButtonRef }) {
  const themeContext = useContext(ThemeContext);
  const {
    setQueryType,
    setSelectedQueryType,
    setCellVariableNames,
    resetStore: resetCellsStore,
  } = useCellsStore(cellsStoreSelector);
  const { tutorialStep, isTutorialRunning, setNextButtonIsDisabled } = useTutorialStore();

  const { setOpenStepIndex, resetStore: resetAccordionStepsStore } = useAccordionStepsStore();

  const handleJoyrideCallback = (data) => {
    const {
      action,
      lifecycle,
      step: { title },
    } = data;

    if (action === ACTIONS.START && lifecycle === LIFECYCLE.INIT && title === 'Select a Query Type') {
      resetAccordionStepsStore();
      resetCellsStore();
      setOpenStepIndex(0);
      setQueryType(queryTypes.gene.value);
      setSelectedQueryType(queryTypes.gene.value);
    }

    if (action === ACTIONS.NEXT && lifecycle === LIFECYCLE.COMPLETE && title === 'Select a Query Type') {
      setParametersButtonRef.current.click();
      setCellVariableNames(['UMOD']);
    }

    if (action === ACTIONS.NEXT && lifecycle === LIFECYCLE.COMPLETE && title === 'Fill in Parameters') {
      setNextButtonIsDisabled(true);
      runQueryButtonRef.current.click();
    }

    if (action === ACTIONS.PREV && lifecycle === LIFECYCLE.COMPLETE && title === 'Fill in Parameters') {
      setOpenStepIndex(0);
    }

    if (action === ACTIONS.PREV && lifecycle === LIFECYCLE.COMPLETE && title === 'View Results') {
      setOpenStepIndex(1);
    }
  };
  const {
    palette: {
      info: { dark: arrowColor },
    },
    zIndex: { tutorial: zIndex },
  } = themeContext;

  return (
    <>
      <Prompt
        headerText="Getting Started"
        descriptionText="Get a tutorial of how to explore the genomic and proteomic information in the HuBMAP data portal."
        buttonText="Take the Molecular Data Queries Tutorial"
        buttonIsDisabled={false}
      />
      <Joyride
        steps={steps}
        callback={handleJoyrideCallback}
        run={isTutorialRunning}
        scrollOffset={100}
        disableOverlayClose
        floaterProps={{
          disableAnimation: true,
        }}
        tooltipComponent={TutorialTooltip}
        styles={{
          options: {
            arrowColor,
            zIndex,
            overlayColor: 'rgba(0, 0, 0, 0)',
          },
        }}
        stepIndex={tutorialStep}
      />
    </>
  );
}

export default CellsTutorial;
