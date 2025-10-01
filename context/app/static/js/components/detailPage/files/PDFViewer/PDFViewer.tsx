import React, { useCallback, useState } from 'react';
import { Document, Page } from 'react-pdf';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import PDFViewerControlButtons from '../PDFViewerControlButtons';
import { ModalContentWrapper, StyledIconButton, StyledCloseIcon, ErrorIcon } from './style';

interface PDFViewerProps {
  pdfUrl: string;
}

// React-PDF's PDF file interface is not exported, this is a minimal version of it.
interface PDFFile {
  numPages: number;
}

interface PDFLoadingIndicatorProps {
  isProcessingPDF: boolean;
  onLoadSuccess: (pdfObj: PDFFile) => void;
  pdfUrl: string;
}
function PDFLoadingIndicator({ isProcessingPDF, onLoadSuccess, pdfUrl }: PDFLoadingIndicatorProps) {
  if (!isProcessingPDF) {
    return null;
  }
  return (
    <Document
      file={pdfUrl}
      onLoadSuccess={onLoadSuccess}
      loading={<LinearProgress sx={{ maxWidth: '100px' }} />}
      error={
        <Box display="flex">
          <ErrorIcon />
          <Typography>Failed to load</Typography>
        </Box>
      }
    />
  );
}

function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [open, setOpen] = useState(false);
  const [pdf, setPdf] = useState<PDFFile>();
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);

  const onLoadSuccess = useCallback((pdfObj: PDFFile) => {
    setOpen(true);
    setPdf(pdfObj);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setIsProcessingPDF(false);
  }, []);

  return (
    <>
      <Box minWidth="125px">
        {/* We don't open the modal here because there may be an error processing the PDF. */}
        <Button
          type="button"
          onClick={() => {
            setIsProcessingPDF(true);
          }}
          variant="outlined"
        >
          View PDF
        </Button>
      </Box>
      <PDFLoadingIndicator isProcessingPDF={isProcessingPDF} onLoadSuccess={onLoadSuccess} pdfUrl={pdfUrl} />
      <Modal open={open} onClose={handleClose} aria-labelledby="pdf-viewer-modal" aria-describedby="pdf-viewer-modal">
        <ModalContentWrapper>
          <Document file={pdfUrl}>
            <Page pageNumber={currentPageNum} renderTextLayer={false} renderAnnotationLayer={false} />
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
