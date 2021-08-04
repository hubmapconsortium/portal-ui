import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import PDFViewerControlButtons from '../PDFViewerControlButtons';
import { ModalContentWrapper, StyledIconButton, StyledCloseIcon, PaddedDiv, ButtonWrapper } from './style';

function PDFViewer({ pdfUrl }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const [pdf, setPdf] = useState();
  const [processPdf, setProcessPdf] = React.useState(false);

  function onDocumentLoadSuccess(pdfObj) {
    setOpen(true);
    setPdf(pdfObj);
  }

  const handleOpen = () => {
    setProcessPdf(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProcessPdf(false);
  };

  return (
    <PaddedDiv>
      {(!processPdf || open) && (
        <ButtonWrapper>
          <Button type="button" onClick={handleOpen}>
            View PDF
          </Button>
        </ButtonWrapper>
      )}
      {processPdf && (
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<LinearProgress />}
          error={<Typography>Failed to load</Typography>}
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
    </PaddedDiv>
  );
}

export default PDFViewer;
