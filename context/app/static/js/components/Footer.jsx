import React from 'react';
import Typography from '@material-ui/core/Typography';
import Hyperlink from '@material-ui/core/Link';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

export default function Footer() {
  const theme = useTheme();
  return (
    <Grid container justify="center" item xs={12} style={{ padding: theme.spacing(2) }}>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Hyperlink color="inherit" href="https://hubmapconsortium.org">
          Human BioMolecular Atlas Program (HuBMAP)
        </Hyperlink>{' '}
        {new Date().getFullYear()}
        {'. All rights reserved. '}
        Supported by the NIH Common Fund.
      </Typography>
    </Grid>
  );
}
