import React from 'react';
import Typography from '@material-ui/core/Typography';

function Title() {
  return (
    <>
      <Typography variant="h2" component="h1">
        Human BioMolecular Atlas Program
      </Typography>
      <Typography variant="h4" component="h3" color="secondary">
        An open, global atlas of the human body at the cellular level
      </Typography>
    </>
  );
}

export default React.memo(Title);
