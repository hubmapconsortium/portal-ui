import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';

function DocumentationLinks() {
  return (
    <>
      <MenuItem>
        <Link href="/docs" color="primary" underline="none">
          Overview
        </Link>
      </MenuItem>
      {['FAQ', 'About'].map((name) => (
        <MenuItem key={name}>
          <Link href={`/docs/${name.toLowerCase()}`} color="primary" underline="none">
            {name}
          </Link>
        </MenuItem>
      ))}
    </>
  );
}

export default DocumentationLinks;
