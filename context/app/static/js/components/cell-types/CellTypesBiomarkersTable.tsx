import React from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import useCellTypeMarkers from 'js/api/scfind/useCellTypeMarkers';
import Description from 'js/shared-styles/sections/Description';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import LoadingTableRows from 'js/shared-styles/tables/LoadingTableRows';

import { StyledTableContainer } from 'js/shared-styles/tables';
import Paper from '@mui/material/Paper';
import { InternalLink } from 'js/shared-styles/Links';
import { useGeneOntologyDetail } from 'js/hooks/useUBKG';
import Skeleton from '@mui/material/Skeleton';
import IndexedDatasetsSummary from '../organ/OrganCellTypes/IndexedDatasetsSummary';
import { useCellTypesContext } from './CellTypesContext';
import { CollapsibleDetailPageSection } from '../detailPage/DetailPageSection';
import { ScientificNotationDisplayCell } from '../genes/CellTypes/ScientificNotationDisplay';
import { useIndexedDatasetsForCellType } from './hooks';

function GeneDescription({ geneId }: { geneId: string }) {
  const details = useGeneOntologyDetail(geneId);
  if (details.isLoading) {
    return <Skeleton />;
  }
  return <span>{details.data?.summary ?? 'No description available.'}</span>;
}

function CellTypesBiomarkersTable() {
  const { cellTypes } = useCellTypesContext();
  const { data, isLoading } = useCellTypeMarkers({
    cellTypes,
  });
  const indexedDatasetsSummaryProps = useIndexedDatasetsForCellType();

  return (
    <CollapsibleDetailPageSection id="biomarkers" title="Biomarkers">
      <Description
        belowTheFold={
          <IndexedDatasetsSummary {...indexedDatasetsSummaryProps}>
            These results are derived from RNAseq datasets that were indexed by the scFind method to identify marker
            genes associated with the cell type. Not all HuBMAP datasets are currently compatible with this method due
            to differences in data modalities or the availability of cell annotations. This section gives a summary of
            the datasets that are used to compute these results.
          </IndexedDatasetsSummary>
        }
      >
        Explore marker genes associated with the cell type and its statistical metrics as computed by the scFind method.
        It calculates statistical metrics based on uniformly processed HuBMAP RNAseq datasets with cell type
        annotations. The table can be downloaded in TSV format for further analysis.
      </Description>
      <Paper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Precision</TableCell>
                <TableCell>Recall</TableCell>
                <TableCell>F1 Score</TableCell>
              </TableRow>
            </TableHead>
            {isLoading && <LoadingTableRows numberOfCols={5} numberOfRows={3} />}
            {data?.findGeneSignatures?.map(({ genes, precision, recall, f1 }) => (
              <TableRow key={genes}>
                <TableCell>
                  <InternalLink href={`/genes/${genes}`}>{genes}</InternalLink>
                </TableCell>
                <TableCell>
                  <GeneDescription geneId={genes} />
                </TableCell>
                <ScientificNotationDisplayCell value={precision} />
                <ScientificNotationDisplayCell value={recall} />
                <ScientificNotationDisplayCell value={f1} />
              </TableRow>
            ))}
          </Table>
        </StyledTableContainer>
      </Paper>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(CellTypesBiomarkersTable);
