import React from 'react';

import Box from '@mui/material/Box';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';

import FileBrowser from '../FileBrowser';
import { FilesContextProvider } from '../FilesContext';
import { UnprocessedFile } from '../types';

interface FilesProps {
  files: UnprocessedFile[];
  includeAccordion?: boolean;
}

function Files({ files, includeAccordion }: FilesProps) {
  const fileContent = files.length > 0 && (
    <Box mb={2}>
      <FileBrowser files={files} />
    </Box>
  );

  return (
    <FilesContextProvider>
      {includeAccordion ? (
        <CollapsibleDetailPageSection id="files" title="Files">
          {fileContent}
        </CollapsibleDetailPageSection>
      ) : (
        fileContent
      )}
    </FilesContextProvider>
  );
}

export default Files;
