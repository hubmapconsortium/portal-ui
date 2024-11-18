import React, { useRef } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import QuerySelect from 'js/components/cells/QuerySelect';
import CellsResults from 'js/components/cells/CellsResults';
import CellsTutorial from 'js/components/cells/tutorial/CellsTutorial';
import { withTutorialProvider } from 'js/shared-styles/tutorials/TutorialProvider';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/store';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';

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
      <PageTitle data-testid="molecular-data-queries-title" color="primary">
        Datasets: Molecular Data Queries (BETA)
      </PageTitle>
      <Stack component={SectionPaper} direction="column" spacing={2}>
        <Typography>
          Retrieve datasets based on the abundance of transcriptomic, epigenomic, and proteomic biomarkers across cells,
          or cell types across organs/datasets.
        </Typography>
        <Typography>
          For example, you can retrieve a list of datasets where normalized transcript abundance for the UMOD
          (uromodulin) gene is above a user-defined cut off, e.g., 1, in at least 5% of all cells. This query will
          return a list of kidney datasets.
        </Typography>
        <Typography>
          To begin your search, select a query type (&quot;Gene&quot; for transcriptomic and epigenomic measurements,
          &quot;Protein&quot; for proteomic measurements, &quot;Cell Type&quot; for cell type distribution) and set the
          desired parameters.
        </Typography>
        <Typography>
          <ContactUsLink>Contact us</ContactUsLink> with any questions and issues that may arise during your experience.
        </Typography>
      </Stack>
      <AccordionSteps id="cells-steps" steps={steps} />
    </AccordionStepsProvider>
  );
}

export default withTutorialProvider(Cells, 'cells');
