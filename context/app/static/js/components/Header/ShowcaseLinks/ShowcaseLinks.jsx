import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

function ShowcaseLinks() {
  return (
    <>
      {['Spraggins'].map((showcaseName) => (
        <MenuItem key={showcaseName}>
          <a href={`/showcase/${showcaseName.toLowerCase()}`} className="navLinkDropDown">
            {showcaseName}
          </a>
        </MenuItem>
      ))}
    </>
  );
}

export default ShowcaseLinks;
