import React from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { InternalLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import { HeaderCell } from 'js/shared-styles/tables';
import { useDatasetTypeMap } from 'js/components/home/HuBMAPDatasetsChart/hooks';

import { Flex, StyledInfoIcon, StyledDatasetIcon } from '../style';
import { getSearchURL } from '../utils';

function Assays({ organTerms, bucketData }) {
  const assayTypeMap = useDatasetTypeMap();

  return (
    <>
      <SpacedSectionButtonRow
        leftText={
          <Flex>
            <SectionHeader>Assays</SectionHeader>
            <SecondaryBackgroundTooltip title="Experiments related to this organ">
              <StyledInfoIcon color="primary" />
            </SecondaryBackgroundTooltip>
          </Flex>
        }
        buttons={
          <Button
            color="primary"
            variant="contained"
            component="a"
            href={getSearchURL({ entityType: 'Dataset', organTerms })}
          >
            <StyledDatasetIcon />
            View All Datasets
          </Button>
        }
      />
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
    </>
  );
}

export default Assays;
