import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FileIcon } from 'js/shared-styles/icons';
// import DetailAccordion from 'js/shared-styles/accordions/DetailsAccordion';
import FilesConditionalLink from 'js/components/detailPage/BulkDataTransfer/FilesConditionalLink';

import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { UnprocessedFile } from '../types';
import { useFilesContext } from '../FilesContext';
import { useFileLink } from './hooks';
import DownloadFileButton from './DownloadFileButton';
import { FileSize } from './FileSize';
// import { PipelineInfo } from './PipelineInfo';

interface DataProductProps {
  file: UnprocessedFile;
}

export function DataProduct({ file }: DataProductProps) {
  const link = useFileLink(file);
  const { openDUA, hasAgreedToDUA } = useFilesContext();
  const trackEntityPageEvent = useTrackEntityPageEvent();
  return (
    <Box key={file.rel_path} data-testid="data-product" sx={{ py: 1.5 }}>
      <Box display="flex">
        <Box px={2.5}>
          <FileIcon
            sx={(theme) => ({
              color: theme.palette.primary.main,
              flexShrink: 0,
              fontSize: '1.5rem',
            })}
          />
        </Box>
        <Box width="100%">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <div>
              <FilesConditionalLink
                openDUA={() => openDUA(link)}
                hasAgreedToDUA={hasAgreedToDUA}
                href={link}
                underline="none"
                download
                variant="subtitle1"
                fileName={file.rel_path}
                onClick={() =>
                  trackEntityPageEvent({ action: 'Data Products / Download File Link', label: file.rel_path })
                }
              />
              <FileSize size={file.size} />
            </div>
            <DownloadFileButton file={file} />
          </Box>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {file.description} (Format: {file.edam_term})
          </Typography>
          {/* Hide data generation section until accurate values are available */}
          {/* <DetailAccordion summary="Additional Details">
              <Box component="dl" my={0}>
                <Typography variant="subtitle2" component="dt">
                  Data Generation
                </Typography>
                <Typography variant="body2" component="dd">
                  Data was generated by <PipelineInfo />
                </Typography>
              </Box>
            </DetailAccordion> */}
        </Box>
      </Box>
    </Box>
  );
}
