import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { capitalize } from '@mui/material/utils';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { useCellTypeOrgans } from 'js/api/scfind/useCellTypeNames';
import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import ScFindDatasetsSection from './ScFindDatasetsSection';

const relevantPages = [
  { link: '/search/biomarkers-cell-types', children: 'Molecular & Cellular Query' },
  { link: '/cell-types', children: 'Cell Types' },
  { link: '/biomarkers', children: 'Biomarkers' },
];

export default function ScFindAbout() {
  const organs = useCellTypeOrgans();
  const { data: rnaIndexed, isLoading: rnaLoading } = useIndexedDatasets(undefined);
  const { data: atacIndexed, isLoading: atacLoading } = useIndexedDatasets('ATAC');

  const rnaCount = rnaIndexed?.datasets.length ?? 0;
  const atacCount = atacIndexed?.datasets.length ?? 0;

  return (
    <Box>
      <Box mb={2.5}>
        <PageTitle>scFind Method</PageTitle>
      </Box>
      <Stack component={SectionPaper} direction="column" spacing={2} mb={2}>
        <LabelledSectionText label="What is scFind?">
          The scFind method calculates cell count proportions and statistical metrics based on uniformly processed
          HuBMAP RNAseq or ATACseq datasets with cell type annotations. More information can be found{' '}
          <OutboundIconLink href="https://www.nature.com/articles/s41592-021-01076-9">here</OutboundIconLink>.
        </LabelledSectionText>
        <LabelledSectionText label="What does scFind currently support?">
          These results are derived from RNAseq or ATACseq datasets to identify cell types expressing a given gene. Not
          all HuBMAP datasets are currently compatible with this method due to data modalities or the availability of
          cell annotations. A summary of the datasets that are used to compute these results is available below.
        </LabelledSectionText>
        <LabelledSectionText label="What organs does scFind currently cover?">
          {organs.length === 0 ? <Skeleton width={240} /> : organs.map((organ) => capitalize(organ)).join(', ')}
        </LabelledSectionText>
        <LabelledSectionText label="What data types does scFind currently cover?">
          {rnaLoading || atacLoading ? (
            <Skeleton width={320} />
          ) : (
            `RNAseq (${rnaCount} datasets), ATACseq (${atacCount} datasets)`
          )}
        </LabelledSectionText>
        <RelevantPagesSection pages={relevantPages} />
      </Stack>
      <ScFindDatasetsSection />
    </Box>
  );
}
