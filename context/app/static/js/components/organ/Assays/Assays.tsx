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
import { OrganPageIds } from 'js/components/organ/types';
import OrganDetailSection from 'js/components/organ/OrganDetailSection';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { useOrganContext } from 'js/components/organ/contexts';
import { useEventCallback } from '@mui/material';
import { trackEvent } from 'js/helpers/trackers';
import { getSearchURL } from '../utils';

interface AssaysProps {
  organTerms: string[];
  bucketData: { key: string; doc_count: number }[];
}

function Assays({ organTerms, bucketData }: AssaysProps) {
  const assayTypeMap = useDatasetTypeMap();
  const {
    organ: { name },
  } = useOrganContext();

  const handleSelectTrack = useEventCallback((assay: string) => {
    trackEvent({
      category: 'Organ Page',
      action: 'Assays / Select Assay From Table',
      label: `${name} ${assay}`,
    });
  });

  return (
    <OrganDetailSection
      id={OrganPageIds.assaysId}
      title="Assays"
      iconTooltipText="Experiments related to this organ"
      action={
        <ViewEntitiesButton
          entityType="Dataset"
          filters={{ organTerms }}
          trackingInfo={{ action: 'Assays', label: name }}
        />
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
                  onClick={() => handleSelectTrack(bucket.key)}
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
    </OrganDetailSection>
  );
}

export default withShouldDisplay(Assays);
