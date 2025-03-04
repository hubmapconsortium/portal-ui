import React from 'react';
import { format } from 'date-fns/format';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import Description from 'js/shared-styles/sections/Description';
import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { HeaderCell } from 'js/shared-styles/tables';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { InternalLink } from 'js/shared-styles/Links';
import { getFileName } from 'js/helpers/functions';
import ViewEntitiesButton from 'js/components/organ/ViewEntitiesButton';
import { OrganDataProducts } from 'js/components/organ/types';

const description = [
  'Download HuBMAP-wide data products that contain consolidated data for datasets of a particular assay type and tissue, aggregated across multiple datasets. You can also explore the datasets that contribute to each data product.',
  'Both raw and processed data products may be available. Raw data products are the concatenated results of HIVE processing without filtering or normalization. Processed data products have undergone clustering and other analytical processes.',
];

interface DataProductsProps {
  id: string;
  dataProducts: OrganDataProducts[];
}

function DataProducts({ id, dataProducts }: DataProductsProps) {
  return (
    <CollapsibleDetailPageSection id={id} title="Data Products">
      <Stack spacing={1}>
        <Description>
          <Stack spacing={1} direction="column">
            {description.map((block) => (
              <Typography key={block}>{block}</Typography>
            ))}
          </Stack>
        </Description>
        <Paper>
          <EntitiesTable
            headerCells={[
              { headerId: 'organ', label: 'Organ' },
              { headerId: 'assay-type', label: 'Assay Type' },
              { headerId: 'raw-download', label: 'Raw Download' },
              { headerId: 'processed-download', label: 'Processed Download' },
              { headerId: 'shiny-app', label: 'Shiny App' },
              { headerId: 'creation-date', label: 'Creation Date' },
              { headerId: '', label: '' },
            ].map(({ headerId, label }) => (
              <HeaderCell key={headerId}>{label}</HeaderCell>
            ))}
            tableRows={dataProducts.map(
              ({ data_product_id, tissue, assay, download_raw, download, shiny_app, creation_time, datasetUUIDs }) => (
                <TableRow key={data_product_id}>
                  <TableCell>{tissue.tissuetype}</TableCell>
                  <TableCell>{assay.assayName}</TableCell>
                  <TableCell>
                    <InternalLink href={download_raw} variant="body2">
                      {getFileName(download_raw)}
                    </InternalLink>
                  </TableCell>
                  <TableCell>
                    <InternalLink href={download} variant="body2">
                      {getFileName(download)}
                    </InternalLink>
                  </TableCell>
                  <TableCell>
                    <OutboundIconLink href={shiny_app} variant="body2">
                      View
                    </OutboundIconLink>
                  </TableCell>
                  <TableCell>{format(new Date(creation_time), 'yyyy-MM-dd')}</TableCell>
                  <TableCell>
                    <ViewEntitiesButton entityType="Dataset" filters={{ datasetUUIDs }} />
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
