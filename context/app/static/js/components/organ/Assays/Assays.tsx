import React from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { InternalLink } from 'js/shared-styles/Links';
import DatasetsBarChart from 'js/components/organ/OrganDatasetsChart';
import { HeaderCell } from 'js/shared-styles/tables';
import { useDatasetTypeMap } from 'js/components/home/HuBMAPDatasetsChart/hooks';
import ViewEntitiesButton from 'js/components/organ/ViewEntitiesButton';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { OrganPageIds } from 'js/components/organ/types';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { getSearchURL } from '../utils';

interface AssaysProps {
  organTerms: string[];
  bucketData: { key: string; doc_count: number }[];
}

function Assays({ organTerms, bucketData }: AssaysProps) {
  const assayTypeMap = useDatasetTypeMap();

  return (
    <CollapsibleDetailPageSection
      id={OrganPageIds.assaysId}
      title="Assays"
      iconTooltipText="Experiments related to this organ"
      action={<ViewEntitiesButton entityType="Dataset" filters={{ organTerms }} />}
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
