import React from 'react';
import Button from '@material-ui/core/Button';

function ProvTableDerivedLink(props) {
  const { uuid, type } = props;
  return (
    <Button
      component="a"
      href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${type}`}
      size="large"
      color="primary"
      variant="contained"
    >
      View Derived {type}s
    </Button>
  );
}

export default ProvTableDerivedLink;
