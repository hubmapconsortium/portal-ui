import React from 'react';
import { format } from 'date-fns/format';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { useEventCallback } from '@mui/material/utils';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import Description from 'js/shared-styles/sections/Description';
import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { HeaderCell } from 'js/shared-styles/tables';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { InternalLink } from 'js/shared-styles/Links';
import { getFileName } from 'js/helpers/functions';
import ViewEntitiesButton from 'js/components/organ/ViewEntitiesButton';
import { OrganDataProducts, OrganPageIds } from 'js/components/organ/types';
import { useOrganContext } from 'js/components/organ/contexts';
import OrganDetailSection from 'js/components/organ/OrganDetailSection';
import { trackEvent } from 'js/helpers/trackers';

const description = [
  'Download HuBMAP-wide data products that contain consolidated data for datasets of a particular assay type and tissue, aggregated across multiple datasets. You can also explore the datasets that contribute to each data product.',
  'Both raw and processed data products may be available. Raw data products are the concatenated results of HIVE processing without filtering or normalization. Processed data products have undergone clustering and other analytical processes.',
];

const headerCells = [
  { headerId: 'organ', label: 'Organ' },
  { headerId: 'assay-type', label: 'Assay Type' },
  { headerId: 'raw-download', label: 'Raw Download' },
  { headerId: 'processed-download', label: 'Processed Download' },
  { headerId: 'shiny-app', label: 'Shiny App' },
  { headerId: 'creation-date', label: 'Creation Date' },
  { headerId: 'view-datasets-button', label: '' },
].map(({ headerId, label }) => (
  <HeaderCell key={headerId} aria-label={label === '' ? headerId : label}>
    {label}
  </HeaderCell>
));

interface DataProductsProps {
  dataProducts: OrganDataProducts[];
  isLateral?: boolean;
  isLoading?: boolean;
}

function DataProducts({ dataProducts, isLateral, isLoading }: DataProductsProps) {
  const {
    organ: { name },
  } = useOrganContext();

  const handleTrack = useEventCallback(
    ({
      action,
      assayName,
      tissueType,
      fileName,
    }: {
      action: string;
      assayName: string;
      tissueType: string;
      fileName?: string;
    }) => {
      const laterality = isLateral
        ? ` Laterality: ${/\((left|right)\)/i.exec(tissueType)?.[1].toLowerCase() ?? ''}`
        : '';
      const assay = ` Assay: ${assayName}`;
      const file = fileName ? ` File: ${fileName}` : '';

      trackEvent({
        category: 'Organ Detail Page: Data Products',
        action: `Data Products / ${action}`,
        label: `${name}${laterality}${assay}${file}`,
      });
    },
  );

  if (isLoading) {
    return (
      <OrganDetailSection id={OrganPageIds.dataProductsId} title="Data Products">
        <Skeleton variant="rectangular" height={400} />
      </OrganDetailSection>
    );
  }

  return (
    <OrganDetailSection id={OrganPageIds.dataProductsId} title="Data Products">
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
            headerCells={headerCells}
            tableRows={dataProducts.map(
              ({ data_product_id, tissue, assay, download_raw, download, shiny_app, creation_time, datasetUUIDs }) => {
                const rawFileName = getFileName(download_raw, 'none');
                const processedFileName = getFileName(download, 'none');
                const { assayName } = assay;
                const { tissuetype: tissueType } = tissue;

                return (
                  <TableRow key={data_product_id}>
                    <TableCell>{tissue.tissuetype}</TableCell>
                    <TableCell>{assayName}</TableCell>
                    <TableCell>
                      <InternalLink
                        href={download_raw}
                        onClick={() =>
                          handleTrack({ action: 'Download Raw', assayName, fileName: rawFileName, tissueType })
                        }
                        variant="body2"
                      >
                        {rawFileName}
                      </InternalLink>
                    </TableCell>
                    <TableCell>
                      <InternalLink
                        href={download}
                        onClick={() =>
                          handleTrack({
                            action: 'Download Processed',
                            assayName,
                            fileName: processedFileName,
                            tissueType,
                          })
                        }
                        variant="body2"
                      >
                        {processedFileName}
                      </InternalLink>
                    </TableCell>
                    <TableCell>
                      {shiny_app && (
                        <OutboundIconLink
                          href={shiny_app}
                          onClick={() => handleTrack({ action: 'View Shiny App', assayName, tissueType })}
                          variant="body2"
                        >
                          View
                        </OutboundIconLink>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(creation_time), 'yyyy-MM-dd')}</TableCell>
                    <TableCell>
                      <ViewEntitiesButton
                        entityType="Dataset"
                        filters={{ datasetUUIDs }}
                        onClick={() => handleTrack({ action: 'View Datasets', assayName, tissueType })}
                      />
                    </TableCell>
                  </TableRow>
                );
              },
            )}
          />
        </Paper>
      </Stack>
    </OrganDetailSection>
  );
}

export default withShouldDisplay(DataProducts);
