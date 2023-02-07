import React, { useRef } from 'react';
import Typography from '@material-ui/core/Typography';

import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import QuerySelect from 'js/components/cells/QuerySelect';
import CellsResults from 'js/components/cells/CellsResults';
import CellsTutorial from 'js/components/cells/tutorial/CellsTutorial';
import { withTutorialProvider } from 'js/shared-styles/tutorials/TutorialProvider';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/provider';

function Cells() {
  // Refs for the step actions used to traverse forwards in the tutorial.
  const setParametersButtonRef = useRef(null);
  const runQueryButtonRef = useRef(null);

  // Refs for the accordion steps used to traverse backwards in the tutorial.
  const queryTypeStepRef = useRef(null);
  const parametersStepRef = useRef(null);

  const steps = [
    {
      heading: '1. Query Type',
      content: <QuerySelect setParametersButtonRef={setParametersButtonRef} />,
      ref: queryTypeStepRef,
    },
    {
      heading: '2. Parameters',
      content: <DatasetsSelectedByExpression runQueryButtonRef={runQueryButtonRef} />,
      ref: parametersStepRef,
    },
    {
      heading: '3. Results',
      content: <CellsResults />,
    },
  ];

  return (
    <AccordionStepsProvider stepsLength={steps.length}>
      <CellsTutorial
        setParametersButtonRef={setParametersButtonRef}
        runQueryButtonRef={runQueryButtonRef}
        queryTypeStepRef={queryTypeStepRef}
        parametersStepRef={parametersStepRef}
      />
      <Typography variant="h2" component="h1" color="primary">
        Datasets: Molecular Data Queries
      </Typography>
      <SectionPaper>
        Refine datasets to discover genomic and proteomic information including expression distribution and cluster
        membership. To begin your search, select a query type and the relevant parameters.
      </SectionPaper>
      <AccordionSteps id="cells-steps" steps={steps} isFirstStepOpen />
    </AccordionStepsProvider>
  );
}

export default withTutorialProvider(Cells, 'has_exited_cells_tutorial');
