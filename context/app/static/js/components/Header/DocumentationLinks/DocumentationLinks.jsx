import React from 'react';
import PropTypes from 'prop-types';

import DropdownLink from '../DropdownLink';

function DocumentationLinks(props) {
  const { isIndented } = props;
  return (
    <>
      <DropdownLink href="/docs" isIndented={isIndented}>
        Overview
      </DropdownLink>
      {['FAQ', 'About'].map((name) => (
        <DropdownLink key={name} href={`/docs/${name.toLowerCase()}`} isIndented={isIndented}>
          {name}
        </DropdownLink>
      ))}
    </>
  );
}

DocumentationLinks.propTypes = {
  isIndented: PropTypes.bool,
};

DocumentationLinks.defaultProps = {
  isIndented: false,
};

export default DocumentationLinks;
