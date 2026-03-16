import React, { useState, useMemo } from 'react';
import { format } from 'date-fns/format';
import prettyBytes from 'pretty-bytes';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
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
import { OrganDataProducts, OrganFile, OrganPageIds } from 'js/components/organ/types';
import { useOrganContext } from 'js/components/organ/contexts';
import OrganDetailSection from 'js/components/organ/OrganDetailSection';
import { trackEvent } from 'js/helpers/trackers';
import URLSvgIcon from 'js/shared-styles/icons/URLSvgIcon';
import { useOrganNameMapping } from 'js/hooks/useOrgansApi';

export const description = [
  'Download HuBMAP-wide integrated maps that contain consolidated data for datasets of a particular assay type and tissue, aggregated across multiple datasets. You can also explore the datasets that contribute to each integrated map.',
  'Both raw and processed integrated maps may be available. Raw integrated maps are the concatenated results of HIVE processing without filtering or normalization. Processed integrated maps have undergone clustering and other analytical processes.',
];

type SortField = 'tissue' | 'assay' | 'creation_time';
type SortDir = 'asc' | 'desc';

function sortProducts(products: OrganDataProducts[], field: SortField, dir: SortDir): OrganDataProducts[] {
  return [...products].sort((a, b) => {
    let aVal: string;
    let bVal: string;

    if (field === 'tissue') {
      aVal = a.tissue.tissuetype;
      bVal = b.tissue.tissuetype;
    } else if (field === 'assay') {
      aVal = a.assay.assayName;
      bVal = b.assay.assayName;
    } else {
      aVal = a.creation_time;
      bVal = b.creation_time;
    }

    const cmp = aVal.localeCompare(bVal);
    return dir === 'asc' ? cmp : -cmp;
  });
}

function sumCellCounts(counts: Record<string, number> | undefined): number {
  if (!counts) return 0;
  return Object.values(counts).reduce((sum, n) => sum + n, 0);
}

type TrackHandler = (args: { action: string; assayName: string; tissueType: string; fileName?: string }) => void;

export function DataProductsTable({
  dataProducts,
  onTrack,
  standalone = false,
  organs,
}: {
  dataProducts: OrganDataProducts[];
  onTrack?: TrackHandler;
  standalone?: boolean;
  organs?: Record<string, OrganFile>;
}) {
  const organNameMapping = useOrganNameMapping(organs);

  const [sortField, setSortField] = useState<SortField>('creation_time');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = useEventCallback((field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  });

  const sortedProducts = useMemo(
    () => sortProducts(dataProducts, sortField, sortDir),
    [dataProducts, sortField, sortDir],
  );

  const headerCells = (
    <>
      {(['tissue', 'assay'] as SortField[]).map((id) => {
        const label = id === 'tissue' ? 'Organ' : 'Assay Type';
        const active = sortField === id;
        return (
          <HeaderCell key={id}>
            <TableSortLabel active={active} direction={active ? sortDir : 'desc'} onClick={() => handleSort(id)}>
              {label}
            </TableSortLabel>
          </HeaderCell>
        );
      })}
      <HeaderCell key="raw-download">Raw Download</HeaderCell>
      <HeaderCell key="processed-download">Processed Download</HeaderCell>
      <HeaderCell key="shiny-app">Shiny App</HeaderCell>
      <HeaderCell key="creation-date">
        <TableSortLabel
          active={sortField === 'creation_time'}
          direction={sortField === 'creation_time' ? sortDir : 'desc'}
          onClick={() => handleSort('creation_time')}
        >
          Creation Date
        </TableSortLabel>
      </HeaderCell>
      <HeaderCell key="view-datasets-button" aria-label="view-datasets-button" />
    </>
  );

  const tableRows = sortedProducts.map(
    ({
      data_product_id,
      tissue,
      assay,
      download_raw,
      download,
      shiny_app,
      creation_time,
      datasetUUIDs,
      raw_cell_type_counts,
      processed_cell_type_counts,
      raw_file_size_bytes,
      processed_file_sizes_bytes,
    }) => {
      const rawFileName = getFileName(download_raw, 'none');
      const processedFileName = getFileName(download, 'none');
      const { assayName } = assay;
      const { tissuetype: tissueType } = tissue;
      const totalRawCells = sumCellCounts(raw_cell_type_counts);
      const totalProcessedCells = sumCellCounts(processed_cell_type_counts);

      const normalizedName = tissueType
        .replace(/\s*\((left|right)\)\s*/i, '')
        .trim()
        .toLowerCase();
      const organKey = organNameMapping[normalizedName] ?? normalizedName.replace(/\s+/g, '-');
      const organHref = `/organs/${encodeURIComponent(organKey)}`;
      const organIcon = organs?.[organKey]?.icon;

      return (
        <TableRow key={data_product_id}>
          <TableCell>
            {standalone ? (
              <Stack direction="row" spacing={1} alignItems="center">
                {organIcon && <URLSvgIcon iconURL={organIcon} ariaLabel={`Icon for ${tissueType}`} />}
                <InternalLink href={organHref} variant="body2">
                  {tissue.tissuetype}
                </InternalLink>
              </Stack>
            ) : (
              tissue.tissuetype
            )}
          </TableCell>
          <TableCell>{assayName}</TableCell>
          <TableCell>
            <Stack spacing={0.5}>
              <InternalLink
                href={download_raw}
                onClick={() => {
                  onTrack?.({ action: 'Download Raw', assayName, fileName: rawFileName, tissueType });
                }}
                variant="body2"
              >
                {rawFileName}
              </InternalLink>
              {rawFileName !== 'none' && (
                <>
                  <Typography variant="caption" color="text.secondary">
                    {raw_file_size_bytes > 0 ? prettyBytes(raw_file_size_bytes) : '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {totalRawCells > 0 ? `${totalRawCells.toLocaleString()} cells` : '—'}
                  </Typography>
                </>
              )}
            </Stack>
          </TableCell>
          <TableCell>
            <Stack spacing={0.5}>
              <InternalLink
                href={download}
                onClick={() => {
                  onTrack?.({ action: 'Download Processed', assayName, fileName: processedFileName, tissueType });
                }}
                variant="body2"
              >
                {processedFileName}
              </InternalLink>
              {processedFileName && processedFileName !== 'none' && (
                <>
                  <Typography variant="caption" color="text.secondary">
                    {processed_file_sizes_bytes > 0 ? prettyBytes(processed_file_sizes_bytes) : '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {totalProcessedCells > 0 ? `${totalProcessedCells.toLocaleString()} cells` : '—'}
                  </Typography>
                </>
              )}
            </Stack>
          </TableCell>
          <TableCell>
            {shiny_app && (
              <OutboundIconLink
                href={shiny_app}
                onClick={() => {
                  onTrack?.({ action: 'View Shiny App', assayName, tissueType });
                }}
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
              onClick={() => {
                onTrack?.({ action: 'View Datasets', assayName, tissueType });
              }}
            />
          </TableCell>
        </TableRow>
      );
    },
  );

  return (
    <Paper sx={standalone ? { '& > div': { maxHeight: 'none' } } : undefined}>
      <EntitiesTable headerCells={headerCells} tableRows={tableRows} />
    </Paper>
  );
}

interface DataProductsProps {
  dataProducts: OrganDataProducts[];
  isLateral?: boolean;
  isLoading?: boolean;
}

function IntegratedMaps({ dataProducts, isLateral, isLoading }: DataProductsProps) {
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
      <OrganDetailSection id={OrganPageIds.integratedMapsId} title="Integrated Maps">
        <Skeleton variant="rectangular" height={400} />
      </OrganDetailSection>
    );
  }

  return (
    <OrganDetailSection id={OrganPageIds.integratedMapsId} title="Integrated Maps">
      <Stack spacing={1}>
        <Description>
          <Stack spacing={1} direction="column">
            {description.map((block) => (
              <Typography key={block}>{block}</Typography>
            ))}
          </Stack>
        </Description>
        <DataProductsTable dataProducts={dataProducts} onTrack={handleTrack} />
      </Stack>
    </OrganDetailSection>
  );
}

export default withShouldDisplay(IntegratedMaps);
