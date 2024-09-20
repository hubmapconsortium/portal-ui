import React from 'react';

import Box from '@mui/material/Box';

import FileBrowser from '../FileBrowser';
import { FilesContextProvider } from '../FilesContext';
import { UnprocessedFile } from '../types';

interface FilesProps {
  files: UnprocessedFile[];
}

function Files({ files }: FilesProps) {
  return (
    <FilesContextProvider>
      {files.length > 0 && (
        <Box mb={2}>
          <FileBrowser files={files} />
        </Box>
      )}
    </FilesContextProvider>
  );
}

export default Files;
