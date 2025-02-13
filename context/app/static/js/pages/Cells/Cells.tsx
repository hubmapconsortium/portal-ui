import React from 'react';
import Stack from '@mui/material/Stack';

import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import QueryParameters from 'js/components/cells/QueryParameters';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import QueryType from 'js/components/cells/QueryType';
import CellsResults from 'js/components/cells/CellsResults';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/store';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

function Cells() {
  const steps = [
    {
      heading: '1. Query Type',
      content: <QueryType />,
    },
    {
      heading: '2. Parameters',
      content: <QueryParameters />,
    },
    {
      heading: '3. Results',
      content: <CellsResults />,
    },
  ];

  return (
    <AccordionStepsProvider stepsLength={steps.length}>
      <PageTitle data-testid="molecular-data-queries-title" color="primary">
        Datasets: Molecular Data Queries (BETA)
      </PageTitle>
      <Stack component={SectionPaper} direction="column" spacing={2}>
        <LabelledSectionText label="What is the molecular and cellular data query?">
          Retrieve datasets based on the abundance of transcriptomic, epigenomic, and proteomic biomarkers across cells,
          or cell types across organs/datasets. For example, you can retrieve a list of datasets where normalized
          transcript abundance for the UMOD (uromodulin) gene is above a user-defined cut off, e.g., 1, in at least 5%
          of all cells. This query will return a list of kidney datasets.
        </LabelledSectionText>
        <LabelledSectionText label="How do I begin?">
          To begin your search, select a query type (&quot;Gene&quot; for transcriptomic and epigenomic measurements,
          &quot;Protein&quot; for proteomic measurements, &quot;Cell Type&quot; for cell type distribution) and set the
          desired parameters.
        </LabelledSectionText>
        <LabelledSectionText label="Questions">
          <ContactUsLink>Contact us</ContactUsLink> with any questions and issues that may arise during your experience.
        </LabelledSectionText>
      </Stack>
      <AccordionSteps id="cells-steps" steps={steps} />
    </AccordionStepsProvider>
  );
}

export default Cells;
