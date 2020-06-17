import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';

function ShowcaseLinks() {
  return (
    <>
      {['Spraggins'].map((showcaseName) => (
        <MenuItem key={showcaseName}>
          <Link href={`/showcase/${showcaseName.toLowerCase()}`} color="primary" underline="none">
            {showcaseName}
          </Link>
        </MenuItem>
      ))}
    </>
  );
}

export default ShowcaseLinks;
