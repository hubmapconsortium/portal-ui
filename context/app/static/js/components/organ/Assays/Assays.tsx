import React, { useMemo } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { useEventCallback } from '@mui/material/utils';

import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { InternalLink } from 'js/shared-styles/Links';
import DatasetsBarChart from 'js/components/organ/OrganDatasetsChart';
import { HeaderCell } from 'js/shared-styles/tables';
import { useSortState } from 'js/hooks/useSortState';
import { useDatasetTypeMap } from 'js/components/home/HuBMAPDatasetsChart/hooks';
import ViewEntitiesButton from 'js/components/organ/ViewEntitiesButton';
import { OrganPageIds } from 'js/components/organ/types';
import OrganDetailSection from 'js/components/organ/OrganDetailSection';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { useOrganContext } from 'js/components/organ/contexts';
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

  const trackClick = useEventCallback((assay: string) => {
    trackEvent({
      category: 'Organ Page',
      action: 'Assays / Select Assay From Table',
      label: `${name} ${assay}`,
    });
  });

  // Default to dataset count descending, matching the order the Elasticsearch aggregation returns.
  const { sortState, setSort } = useSortState({}, { columnId: 'counts', direction: 'desc' });

  const sortedBucketData = useMemo(() => {
    const factor = sortState.direction === 'asc' ? 1 : -1;
    return [...bucketData].sort((a, b) =>
      sortState.columnId === 'assays' ? a.key.localeCompare(b.key) * factor : (a.doc_count - b.doc_count) * factor,
    );
  }, [bucketData, sortState]);

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
            <HeaderCell key={id}>
              <TableSortLabel
                active={sortState.columnId === id}
                direction={sortState.columnId === id ? sortState.direction : undefined}
                onClick={() => setSort(id)}
              >
                {label}
              </TableSortLabel>
            </HeaderCell>
          ))}
          tableRows={sortedBucketData.map((bucket) => (
            <TableRow key={bucket.key}>
              <TableCell>
                <InternalLink
                  href={getSearchURL({ entityType: 'Dataset', organTerms, mappedAssay: bucket.key, assayTypeMap })}
                  onClick={() => {
                    trackClick(bucket.key);
                  }}
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
      <Paper sx={{ mt: 2 }}>
        <DatasetsBarChart search={organTerms} />
      </Paper>
    </OrganDetailSection>
  );
}

export default withShouldDisplay(Assays);
