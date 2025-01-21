import React from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { InternalLink } from 'js/shared-styles/Links';
import DatasetsBarChart from 'js/components/organ/OrganDatasetsChart';

import { HeaderCell } from 'js/shared-styles/tables';
import { useDatasetTypeMap } from 'js/components/home/HuBMAPDatasetsChart/hooks';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { DatasetIcon } from 'js/shared-styles/icons';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { getSearchURL } from '../utils';

interface AssaysProps {
  organTerms: string[];
  bucketData: { key: string; doc_count: number }[];
  id: string;
}

function Assays({ organTerms, bucketData, id: sectionId }: AssaysProps) {
  const assayTypeMap = useDatasetTypeMap();

  return (
    <CollapsibleDetailPageSection
      id={sectionId}
      title="Assays"
      iconTooltipText="Experiments related to this organ"
      action={
        <Button
          color="primary"
          variant="contained"
          component="a"
          href={getSearchURL({ entityType: 'Dataset', organTerms })}
          startIcon={<DatasetIcon />}
        >
          View All Datasets
        </Button>
      }
    >
      <Paper>
        <EntitiesTable
          headerCells={[
            { id: 'assays', label: 'Assays' },
            { id: 'counts', label: 'Dataset Count' },
          ].map(({ id, label }) => (
            <HeaderCell key={id}>{label}</HeaderCell>
          ))}
          tableRows={bucketData.map((bucket) => (
            <TableRow key={bucket.key}>
              <TableCell>
                <InternalLink
                  href={getSearchURL({ entityType: 'Dataset', organTerms, mappedAssay: bucket.key, assayTypeMap })}
                  variant="body2"
                >
                  {bucket.key}
                </InternalLink>
              </TableCell>
              <TableCell>{bucket.doc_count}</TableCell>
            </TableRow>
          ))}
        />
      </Paper>
      <DatasetsBarChart search={organTerms} />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(Assays);
