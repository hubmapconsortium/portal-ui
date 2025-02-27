import React from 'react';
import { format } from 'date-fns/format';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import Description from 'js/shared-styles/sections/Description';
import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { HeaderCell } from 'js/shared-styles/tables';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { DatasetIcon } from 'js/shared-styles/icons';
import { buildSearchLink } from 'js/components/search/store';
import { useDataProducts } from 'js/components/organ/hooks';

interface DataProductsProps {
  id: string;
  organName: string;
}

function DataProducts({ id, organName }: DataProductsProps) {
  const { dataProducts } = useDataProducts(organName);

  return (
    <CollapsibleDetailPageSection id={id} title="Data Products">
      <Stack spacing={1}>
        <Description>Description here</Description>
        <Paper>
          <EntitiesTable
            headerCells={[
              { headerId: 'organ', label: 'Organ' },
              { headerId: 'data-type', label: 'Data Type' },
              { headerId: 'raw-download', label: 'Raw Download' },
              { headerId: 'processed-download', label: 'Processed Download' },
              { headerId: 'creation-date', label: 'Creation Date' },
              { headerId: '', label: '' },
            ].map(({ headerId, label }) => (
              <HeaderCell key={headerId}>{label}</HeaderCell>
            ))}
            tableRows={dataProducts.map(
              ({ data_product_id, tissue, assay, download_raw, download, creation_time, datasetUUIDs }) => (
                <TableRow key={data_product_id}>
                  <TableCell>{tissue.tissuetype}</TableCell>
                  <TableCell>{assay.assayName}</TableCell>
                  <TableCell>
                    <OutboundIconLink href={download_raw} variant="body2">
                      {'Raw<File>'}
                    </OutboundIconLink>
                  </TableCell>
                  <TableCell>
                    <OutboundIconLink href={download} variant="body2">
                      {'Processed<File>'}
                    </OutboundIconLink>
                  </TableCell>
                  <TableCell>{format(new Date(creation_time), 'yyyy-MM-dd')}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      variant="outlined"
                      component="a"
                      href={buildSearchLink({
                        entity_type: 'Dataset',
                        filters: {
                          uuid: {
                            values: datasetUUIDs,
                            type: 'TERM',
                          },
                        },
                      })}
                      startIcon={<DatasetIcon />}
                    >
                      View Datasets
                    </Button>
                  </TableCell>
                </TableRow>
              ),
            )}
          />
        </Paper>
      </Stack>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(DataProducts);
