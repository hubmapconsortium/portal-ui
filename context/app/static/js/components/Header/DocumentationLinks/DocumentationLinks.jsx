import React from 'react';
import PropTypes from 'prop-types';

import DropdownLink from '../DropdownLink';

function DocumentationLinks(props) {
  const { isIndented } = props;
  return (
    <>
      <DropdownLink href="/docs/technical" isIndented={isIndented}>
        Technical
      </DropdownLink>
      <DropdownLink href="/docs/faq" isIndented={isIndented}>
        FAQ
      </DropdownLink>
      <DropdownLink href="/docs/about" isIndented={isIndented}>
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
