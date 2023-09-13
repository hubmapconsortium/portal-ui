import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import { DocumentCallback, OnDocumentLoadSuccess } from 'react-pdf/dist/cjs/shared/types';

import PDFViewerControlButtons from '../PDFViewerControlButtons';
import { ModalContentWrapper, StyledIconButton, StyledCloseIcon, ErrorIcon } from './style';

interface PDFViewerProps {
  pdfUrl: string;
}

function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [open, setOpen] = useState(false);
  const [pdf, setPdf] = useState<DocumentCallback>();
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = (pdfObj) => {
    setOpen(true);
    setPdf(pdfObj);
  };

  const handleClose = () => {
    setOpen(false);
    setIsProcessingPDF(false);
  };

  return (
    <>
      {(!isProcessingPDF || open) && (
        <Box minWidth="125px">
          {/* We don't open the modal here because there may be an error processing the PDF. */}
          <Button type="button" onClick={() => setIsProcessingPDF(true)} variant="outlined">
            View PDF
          </Button>
        </Box>
      )}
      {isProcessingPDF && (
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<LinearProgress sx={{ maxWidth: '100px' }} />}
          error={
            <Box display="flex">
              <ErrorIcon />
              <Typography>Failed to load</Typography>
            </Box>
          }
        />
      )}
      <Modal open={open} onClose={handleClose} aria-labelledby="pdf-viewer-modal" aria-describedby="pdf-viewer-modal">
        <ModalContentWrapper>
          <Document file={pdfUrl}>
            <Page pageNumber={currentPageNum} renderTextLayer={false} />
          </Document>
          {pdf && (
            <PDFViewerControlButtons
              numPages={pdf.numPages}
              currentPageNum={currentPageNum}
              setPageNum={setCurrentPageNum}
            />
          )}
          <StyledIconButton color="primary" onClick={handleClose}>
            <StyledCloseIcon />
          </StyledIconButton>
        </ModalContentWrapper>
      </Modal>
    </>
  );
}

export default PDFViewer;
