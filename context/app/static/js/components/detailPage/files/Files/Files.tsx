import React from 'react';

import { Box } from '@mui/material';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import DetailPageSection from 'js/components/detailPage/DetailPageSection';

import FileBrowser from '../FileBrowser';
import { FilesContextProvider } from '../FilesContext';
import { UnprocessedFile } from '../types';

interface FilesProps {
  files: UnprocessedFile[];
}

function Files({ files }: FilesProps) {
  return (
    <FilesContextProvider>
      <DetailPageSection id="files" data-testid="files">
        <SectionHeader>Files</SectionHeader>
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
