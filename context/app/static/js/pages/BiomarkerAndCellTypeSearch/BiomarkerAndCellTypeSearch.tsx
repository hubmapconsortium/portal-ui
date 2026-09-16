import React from 'react';
import Stack from '@mui/material/Stack';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import MolecularDataQueryForm from 'js/components/cells/MolecularDataQueryForm/MolecularDataQueryForm';
import QueryType from 'js/components/cells/MolecularDataQueryForm/QueryType';
import QueryParametersFieldset from 'js/components/cells/MolecularDataQueryForm/QueryParameters';
import MolecularDataQueryFormTrackingProvider from 'js/components/cells/MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';
import Box from '@mui/material/Box';

function BiomarkerAndCellTypeSearch() {
  return (
    <Box pb={2}>
      <PageTitle data-testid="molecular-data-queries-title" color="primary">
        Biomarker and Cell Type Search
      </PageTitle>
      <Stack component={SectionPaper} direction="column" spacing={2} mb={2}>
        <LabelledSectionText label="What is the biomarker and cell type search?">
          This tool helps retrieve datasets based on the abundance of transcriptomic and epigenomic biomarkers across
          cells, or cell types across datasets.
        </LabelledSectionText>
        <LabelledSectionText label="Example Query">
          For example, you can retrieve a list of datasets that contain the UMOD (uromodulin) gene. This query will
          return a list of kidney datasets.
        </LabelledSectionText>
        <LabelledSectionText label="How do I begin?">
          To begin your search, select a query type (&quot;Gene&quot; for transcriptomic and epigenomic measurements or
          &quot;Cell Type&quot; for cell type distribution) and set the desired parameters. Protein queries were retired
          with the Cells Cross-Modality API.
        </LabelledSectionText>
        <LabelledSectionText label="Questions">
          <ContactUsLink>Contact us</ContactUsLink> with any questions and issues that may arise during your experience.
        </LabelledSectionText>
      </Stack>
      <MolecularDataQueryFormTrackingProvider>
        <MolecularDataQueryForm>
          <QueryType />
          <QueryParametersFieldset />
        </MolecularDataQueryForm>
      </MolecularDataQueryFormTrackingProvider>
    </Box>
  );
}

export default BiomarkerAndCellTypeSearch;
