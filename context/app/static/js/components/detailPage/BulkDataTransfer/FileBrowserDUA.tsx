import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { getDUAText } from './utils';
import { ObliqueSpan, StyledHeader, StyledDiv } from './style';

interface FileBrowserDUAProps {
  isOpen: boolean;
  handleAgree: () => void;
  handleClose: () => void;
  mapped_data_access_level: string;
}

function FileBrowserDUA({ isOpen, handleAgree, handleClose, mapped_data_access_level }: FileBrowserDUAProps) {
  const [isChecked, check] = useState(false);

  const { title, appropriateUse } = getDUAText(mapped_data_access_level);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <StyledDiv id="alert-dialog-description">
          <StyledHeader id="alert-dialog-title" variant="h2">
            {'HuBMAP '} <ObliqueSpan>{`${title} Data`}</ObliqueSpan> {' Usage'}
          </StyledHeader>

          <StyledHeader variant="h4">Appropriate Use</StyledHeader>
          <Typography variant="body1">{appropriateUse}</Typography>
          <StyledHeader variant="h4">Acknowledgement</StyledHeader>
          <Typography variant="body1">
            Investigators using HuBMAP data in publications or presentations are asked to cite the{' '}
            <OutboundLink href="https://arxiv.org/abs/2511.05708">HuBMAP Data Portal paper</OutboundLink> (preprint:{' '}
            <OutboundLink href="https://doi.org/10.48550/arXiv.2511.05708">
              https://doi.org/10.48550/arXiv.2511.05708
            </OutboundLink>
            ) when portal data were used in the study, portal tools were used in methods or analysis, or the portal is
            used as a data repository per journal requirements. See our{' '}
            <OutboundLink href="https://hubmapconsortium.org/acknowledgement-in-publications/">
              citation guidance
            </OutboundLink>{' '}
            for full details.
          </Typography>

          <StyledHeader variant="h4">Data Sharing Policy</StyledHeader>
          <Typography variant="body1">
            The HuBMAP Data Sharing Policy can be found at{' '}
            <OutboundLink href="https://hubmapconsortium.org/policies/">
              https://hubmapconsortium.org/policies/
            </OutboundLink>
            .
          </Typography>
        </StyledDiv>
        <FormControlLabel
          control={
            <Checkbox
              color="secondary"
              checked={isChecked}
              onChange={() => {
                check(!isChecked);
              }}
            />
          }
          label="I have read and agree to the above data use guidelines."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Disagree
        </Button>
        <OptDisabledButton onClick={handleAgree} disabled={!isChecked}>
          Agree
        </OptDisabledButton>
      </DialogActions>
    </Dialog>
  );
}

export default FileBrowserDUA;
