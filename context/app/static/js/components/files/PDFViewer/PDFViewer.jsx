import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
  const [pageNumber, setPageNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const [pdf, setPdf] = useState();
  const [isProcessingPDF, setIsProcessingPDF] = React.useState(false);

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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ModalContentWrapper>
          <Page pageNumber={pageNumber} pdf={pdf} />
          {pdf && (
            <PDFViewerControlButtons numPages={pdf.numPages} currentPageNum={pageNumber} setPageNum={setPageNumber} />
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
