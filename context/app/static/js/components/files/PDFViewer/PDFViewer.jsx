import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import Modal from '@material-ui/core/Modal';

import PDFViewerControlButtons from '../PDFViewerControlButtons';
import { ModalContentWrapper, StyledIconButton, StyledCloseIcon } from './style';

function PDFViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [pageNumber, setPageNumber] = useState(1);

  // eslint-disable-next-line no-shadow
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        Open Modal
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ModalContentWrapper>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          {numPages && (
            <PDFViewerControlButtons numPages={numPages} currentPageNum={pageNumber} setPageNum={setPageNumber} />
          )}
          <StyledIconButton color="primary" onClick={handleClose}>
            <StyledCloseIcon />
          </StyledIconButton>
        </ModalContentWrapper>
      </Modal>
    </div>
  );
}

export default PDFViewer;
