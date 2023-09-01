import React from 'react';

import Box from '@mui/material/Box';

type MultiFileDownloaderProps = {
  files: string[];
};

/**
 * This helper component is used to download multiple files at once.
 * Since browsers prevent multiple downloads being triggered by JS at once,
 * we can mount each link as an invisible iframe to trigger the download instead.
 * @example ```{shouldStartDownload && <MultiFileDownloader files={fileUrls} />}```
 * @param props.files - Array of file URLs to download
 */
function MultiFileDownloader({ files }: MultiFileDownloaderProps) {
  if (files.length === 0) {
    return null;
  }
  return (
    <Box display="none">
      {files.map((file) => (
        <iframe title={file} src={file} key={file} />
      ))}
    </Box>
  );
}

export default MultiFileDownloader;
