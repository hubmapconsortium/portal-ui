import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';
import { getDUAText } from './utils';
import { ObliqueSpan, StyledHeader, StyledDiv } from './style';

function FileBrowserDUA(props) {
  const { isOpen, handleAgree, handleClose, mapped_data_access_level } = props;

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
          <StyledHeader id="alert-dialog-title" variant="h2" component="h1">
            {'HuBMAP '} <ObliqueSpan>{`${title} Data`}</ObliqueSpan> {' Usage'}
          </StyledHeader>

          <StyledHeader variant="h4" component="h2">
            Appropriate Use
          </StyledHeader>
          <Typography variant="body1">{appropriateUse}</Typography>

          <StyledHeader variant="h4" component="h2">
            Acknowledgement
          </StyledHeader>
          <Typography variant="body1">
            Investigators using HuBMAP data in publications or presentations are requested to cite The Human Body at
            Cellular Resolution: the NIH Human BioMolecular Atlas Program (doi:
            <LightBlueLink href="https://doi.org/10.1038/s41586-019-1629-x" target="_blank" rel="noopener noreferrer">
              10.1038/s41586-019-1629-x
            </LightBlueLink>
            ) and to include an acknowledgement of HuBMAP. Suggested language for such an acknowledgment is: “The
            results here are in whole or part based upon data generated by the NIH Human BioMolecular Atlas Program
            (HuBMAP):{' '}
            <LightBlueLink href="https://hubmapconsortium.org" target="_blank" rel="noopener noreferrer">
              https://hubmapconsortium.org
            </LightBlueLink>
            .”
          </Typography>

          <StyledHeader variant="h4" component="h2">
            Data Sharing Policy
          </StyledHeader>
          <Typography variant="body1">
            The HuBMAP Data Sharing Policy can be found at{' '}
            <LightBlueLink href="https://hubmapconsortium.org/policies/" target="_blank" rel="noopener noreferrer">
              https://hubmapconsortium.org/policies/
            </LightBlueLink>
            .
          </Typography>
        </StyledDiv>
        <FormControlLabel
          control={
            <Checkbox
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
        <Button onClick={handleAgree} disabled={!isChecked}>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FileBrowserDUA.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleAgree: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  mapped_data_access_level: PropTypes.string.isRequired,
};

export default FileBrowserDUA;
