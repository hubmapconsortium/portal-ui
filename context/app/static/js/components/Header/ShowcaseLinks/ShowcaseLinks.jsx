import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

function ShowcaseLinks() {
  return (
    <>
      {['Spraggins'].map((showcaseName, i) => (
        <MenuItem key={showcaseName} mt={i === 0}>
          <a href={`/showcase/${showcaseName.toLowerCase()}`}>{showcaseName}</a>
        </MenuItem>
      ))}
    </>
  );
}

export default ShowcaseLinks;
