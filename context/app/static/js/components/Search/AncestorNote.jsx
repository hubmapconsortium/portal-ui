import React from 'react';
import Typography from '@material-ui/core/Typography';
// import { readCookie } from '../../helpers/functions';

function AncestorNote(props) {
  const { uuid } = props;
  return <Typography component="h2">Derived from {uuid}</Typography>;
}

export default AncestorNote;
