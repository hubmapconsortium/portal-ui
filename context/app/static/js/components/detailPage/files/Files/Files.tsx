import React from 'react';

import { Box } from '@mui/material';

import { DetailPageSection } from 'js/components/detailPage/style';

import FileBrowser from '../FileBrowser';
import { FilesContextProvider } from '../FilesContext';
import { UnprocessedFile } from '../types';

interface FilesProps {
  files: UnprocessedFile[];
}

function Files({ files }: FilesProps) {
  return (
    <FilesContextProvider>
      <DetailPageSection>
        {files.length > 0 && (
          <Box mb={2}>
            <FileBrowser files={files} />
          </Box>
        )}
      </DetailPageSection>
    </FilesContextProvider>
  );
}

export default Files;
