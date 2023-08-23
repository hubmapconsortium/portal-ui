import React, { Fragment } from 'react';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { DownloadIcon } from '../../MetadataTable/style';

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
      <Paper sx={{ p: 2 }} data-testid="data-products-container">
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box>
            <Typography component="h3" variant="h4" sx={{ mt: 0.25 }}>
              Data Products
            </Typography>
            <FileSize size={totalFileSize} variant="body2" />
          </Box>
          <Button variant="contained" color="primary" endIcon={<DownloadIcon />} sx={{ borderRadius: '4px' }}>
            Download All
          </Button>
        </Box>
        <Typography component="p" variant="body1" sx={{ my: 1 }}>
          Data products are essential files of this dataset for performing independent review of dataset contents. They
          include information about gene expression levels, RNA velocity, and other products of analysis.
        </Typography>
        <Box>
          {dataProducts.map((file, idx) => (
            <Fragment key={file.rel_path}>
              <DataProduct file={file} />
              {idx < dataProducts.length - 1 && <Divider />}
            </Fragment>
          ))}
        </Box>
      </Paper>
    </FilesContextProvider>
  );
}
