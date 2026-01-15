import React from 'react';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';

import { FilesContextProvider } from '../FilesContext';
import { UnprocessedFile } from '../types';
import FilesTabs from '../FilesTabs';
import { useDetailContext } from '../../DetailContext';

interface IntegratedDatasetFilesProps {
  files: UnprocessedFile[];
  track: (info: { action: string; label: string }) => void;
}

function IntegratedDatasetFiles({ files, track }: IntegratedDatasetFilesProps) {
  const { uuid, hubmap_id } = useDetailContext();
  return (
    <FilesContextProvider>
      <CollapsibleDetailPageSection id="files" title="Files">
        <FilesTabs files={files} uuid={uuid} hubmap_id={hubmap_id} track={track} />
      </CollapsibleDetailPageSection>
    </FilesContextProvider>
  );
}

export default IntegratedDatasetFiles;
