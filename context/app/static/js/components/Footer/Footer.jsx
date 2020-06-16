import React from 'react';
import Typography from '@material-ui/core/Typography';
import Hyperlink from '@material-ui/core/Link';
import { Flex } from './style';

export default function Footer() {
  return (
    <Flex maxWidth="lg">
      <Typography variant="body2" color="secondary">
        {'Copyright © '}
        <Hyperlink color="inherit" href="https://hubmapconsortium.org" target="_blank" rel="noopener noreferrer">
          Human BioMolecular Atlas Program (HuBMAP)
        </Hyperlink>{' '}
        {new Date().getFullYear()}
        {'. All rights reserved. '}
      </Typography>
      <Typography variant="body2" color="secondary">
        Supported by the NIH Common Fund.
      </Typography>
    </Flex>
  );
}
