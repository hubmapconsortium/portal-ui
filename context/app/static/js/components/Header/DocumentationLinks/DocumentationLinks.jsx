import React from 'react';
import PropTypes from 'prop-types';

import DropdownLink from '../DropdownLink';

function DocumentationLinks(props) {
  const { isIndented } = props;
  return (
    <>
      <DropdownLink href="https://software.docs.hubmapconsortium.org/technical" isIndented={isIndented}>
        Technical
      </DropdownLink>
      <DropdownLink href="https://software.docs.hubmapconsortium.org/faq" isIndented={isIndented}>
        FAQ
      </DropdownLink>
      <DropdownLink href="https://software.docs.hubmapconsortium.org/about" isIndented={isIndented}>
        About
      </DropdownLink>
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
