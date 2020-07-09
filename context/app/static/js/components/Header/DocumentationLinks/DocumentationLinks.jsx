import React from 'react';

import DropdownLink from '../DropdownLink';

function DocumentationLinks(props) {
  const { isIndented } = props;
  return (
    <>
      <DropdownLink href="/docs" color="primary" underline="none" isIndented={isIndented}>
        Overview
      </DropdownLink>
      {['FAQ', 'About'].map((name) => (
        <DropdownLink href={`/docs/${name.toLowerCase()}`} color="primary" underline="none" isIndented={isIndented}>
          {name}
        </DropdownLink>
      ))}
    </>
  );
}

export default DocumentationLinks;
