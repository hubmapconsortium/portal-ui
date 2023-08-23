import { IconButton } from '@mui/material';
import React from 'react';
import { UnprocessedFile } from '../types';
import { useFileLink } from './hooks';
import { DownloadIcon } from '../../MetadataTable/style';

type DownloadFileButtonProps = {
  file: UnprocessedFile;
};

function DownloadFileButton({ file }: DownloadFileButtonProps) {
  const link = useFileLink(file);

  return (
    <IconButton size="small" color="primary" aria-label={`Download ${file.rel_path}`} download href={link}>
      <DownloadIcon />
    </IconButton>
  );
}

export default DownloadFileButton;
