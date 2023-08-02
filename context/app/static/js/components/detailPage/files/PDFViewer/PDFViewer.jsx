import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import PDFViewerControlButtons from '../PDFViewerControlButtons';
import {
  ModalContentWrapper,
  StyledIconButton,
  StyledCloseIcon,
  ButtonWrapper,
  Flex,
  ErrorIcon,
  StyledLinearProgress,
} from './style';

function PDFViewer({ pdfUrl }) {
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [open, setOpen] = useState(false);
  const [pdf, setPdf] = useState();
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);

  function onDocumentLoadSuccess(pdfObj) {
    setOpen(true);
    setPdf(pdfObj);
  }

  const handleClose = () => {
    setOpen(false);
    setIsProcessingPDF(false);
  };

  return (
    <>
      {(!isProcessingPDF || open) && (
        <ButtonWrapper>
          {/* We don't open the modal here because there may be an error processing the PDF. */}
          <Button type="button" onClick={() => setIsProcessingPDF(true)} variant="outlined">
            View PDF
          </Button>
        </ButtonWrapper>
      )}
      {isProcessingPDF && (
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<StyledLinearProgress />}
          error={
            <Flex>
              <ErrorIcon />
              <Typography>Failed to load</Typography>
            </Flex>
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
