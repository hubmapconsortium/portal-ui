import { IconButton, IconButtonProps } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useTrackEntityPageEvent } from 'js/components/detailPage//useTrackEntityPageEvent';
import { UnprocessedFile } from '../types';
import { useFileLink } from './hooks';
import { DownloadIcon } from '../../MetadataTable/style';
import { useFilesContext } from '../FilesContext';

interface DownloadFileButtonProps {
  file: UnprocessedFile;
}

function DUADownloadButton({ file, children }: PropsWithChildren<DownloadFileButtonProps>) {
  const link = useFileLink(file);
  const { hasAgreedToDUA, openDUA } = useFilesContext();
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const sharedProps = {
    size: 'small',
    color: 'primary',
    'aria-label': `Download ${file.rel_path}`,
  } satisfies Partial<IconButtonProps>;
  if (hasAgreedToDUA) {
    return (
      <IconButton
        {...sharedProps}
        download
        href={link}
        onClick={() => trackEntityPageEvent({ action: 'Data Products / Download File Button', label: file.rel_path })}
      >
        {children}
      </IconButton>
    );
  }
  return (
    <IconButton {...sharedProps} onClick={() => openDUA(link)}>
      {children}
    </IconButton>
  );
}

function DownloadFileButton({ file }: DownloadFileButtonProps) {
  return (
    <SecondaryBackgroundTooltip title="Download file">
      <DUADownloadButton file={file}>
        <DownloadIcon />
      </DUADownloadButton>
    </SecondaryBackgroundTooltip>
  );
}

export default DownloadFileButton;
