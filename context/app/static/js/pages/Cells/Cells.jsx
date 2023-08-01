import React, { useRef } from 'react';
import Typography from '@mui/material/Typography';

import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import QuerySelect from 'js/components/cells/QuerySelect';
import CellsResults from 'js/components/cells/CellsResults';
import CellsTutorial from 'js/components/cells/tutorial/CellsTutorial';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { withTutorialProvider } from 'js/shared-styles/tutorials/TutorialProvider';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/provider';

function Cells() {
  // Refs for the step actions used to traverse forwards in the tutorial.
  const setParametersButtonRef = useRef(null);
  const runQueryButtonRef = useRef(null);

  const steps = [
    {
      heading: '1. Query Type',
      content: <QuerySelect setParametersButtonRef={setParametersButtonRef} />,
    },
    {
      heading: '2. Parameters',
      content: <DatasetsSelectedByExpression runQueryButtonRef={runQueryButtonRef} />,
    },
    {
      heading: '3. Results',
      content: <CellsResults />,
    },
  ];

  return (
    <AccordionStepsProvider stepsLength={steps.length}>
      <CellsTutorial setParametersButtonRef={setParametersButtonRef} runQueryButtonRef={runQueryButtonRef} />
      <PageTitle color="primary">Datasets: Molecular Data Queries (BETA)</PageTitle>
      <SectionPaper>
        <Typography>
          Retrieve datasets based on the abundance of transcriptomic, epigenomic, and proteomic biomarkers across cells.
          For example, you can retrieve a list of datasets where normalized transcript abundance for the UMOD
          (uromodulin) gene is above a user-defined cut off, e.g., 1, in at least 5% of all cells. This query will
          return a list of kidney datasets. To begin your search, select a query type (&quot;Gene&quot; for
          transcriptomic and epigenomic measurements, &quot;Protein&quot; for proteomic measurements) and set the
          desired parameters. The nature of the cut off values is modality dependent, e.g., RPKM for transcriptomics.
          Molecular data queries are in beta testing and there is a list of{' '}
          <OutboundLink href="https://github.com/hubmapconsortium/portal-ui/issues?q=is%3Aopen+is%3Aissue+label%3A%22feature%3A+cells%22">
            known issues
          </OutboundLink>
          .
        </Typography>
      </SectionPaper>
      <AccordionSteps id="cells-steps" steps={steps} isFirstStepOpen />
    </AccordionStepsProvider>
  );
}

export default withTutorialProvider(Cells, 'cells');
