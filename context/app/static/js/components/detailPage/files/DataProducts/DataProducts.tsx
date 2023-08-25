import React from 'react';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { StyledInfoIcon } from 'js/shared-styles/sections/LabelledSectionText/style';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { DownloadIcon } from 'js/components/detailPage/MetadataTable/style';

import theme from 'js/theme';
import { UnprocessedFile } from '../types';
import { FilesContextProvider } from '../FilesContext';
import { FileSize } from './FileSize';
import { DataProduct } from './DataProduct';

type DataProductsProps = {
  files: UnprocessedFile[];
};

export function DataProducts({ files }: DataProductsProps) {
  const dataProducts = files.filter((file) => file.is_data_product);

  if (dataProducts.length === 0) {
    return null;
  }

  const totalFileSize = dataProducts.reduce((acc, file) => acc + file.size, 0);

  return (
    <FilesContextProvider>
      <Paper sx={{ p: 2, borderTop: `1px solid ${theme.palette.outline}` }} data-testid="data-products-container">
        <Box display="flex" justifyContent="space-between" alignItems="start" pb={2}>
          <Box data-testid="data-products-title-and-size">
            <Box display="flex" alignItems="center">
              <Typography component="h3" variant="h4" display="inline-block">
                Data Products
              </Typography>
              <SecondaryBackgroundTooltip title="Essential files of interest for this dataset.">
                <StyledInfoIcon color="primary" />
              </SecondaryBackgroundTooltip>
            </Box>
            <FileSize size={totalFileSize} variant="body1" color="secondary.secondary" />
          </Box>
          <Button variant="contained" color="primary" startIcon={<DownloadIcon />} sx={{ borderRadius: '4px' }}>
            Download All
          </Button>
        </Box>
        <Stack divider={<Divider />}>
          {dataProducts.map((file) => (
            <DataProduct file={file} key={file.rel_path} />
          ))}
        </Stack>
      </Paper>
    </FilesContextProvider>
  );
}
