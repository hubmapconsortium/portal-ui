import React, { useMemo } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { InternalLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import useSearchData from 'js/hooks/useSearchData';
import { HeaderCell } from 'js/shared-styles/tables';
import { useDatasetTypeMap } from 'js/components/home/HuBMAPDatasetsChart/hooks';

import { Flex, StyledInfoIcon, StyledDatasetIcon } from '../style';
import { getSearchURL } from '../utils';

function Assays({ organTerms }) {
  const assayTypeMap = useDatasetTypeMap();

  const query = useMemo(
    () => ({
      size: 0,
      aggs: {
        mapped_data_types: {
          filter: {
            bool: {
              must: [
                {
                  term: {
                    'entity_type.keyword': 'Dataset',
                  },
                },
                {
                  bool: {
                    should: organTerms.map((searchTerm) => ({
                      term: { 'origin_samples.mapped_organ.keyword': searchTerm },
                    })),
                  },
                },
              ],
            },
          },
          aggs: {
            'assay_display_name.keyword': { terms: { field: 'assay_display_name.keyword', size: 100 } },
            'assay_display_name.keyword_count': { cardinality: { field: 'assay_display_name.keyword' } },
          },
        },
      },
    }),
    [organTerms],
  );

  const { searchData } = useSearchData(query);
  const buckets = searchData.aggregations
    ? searchData.aggregations.mapped_data_types['assay_display_name.keyword'].buckets
    : [];

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
          tableRows={buckets.map((bucket) => (
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
