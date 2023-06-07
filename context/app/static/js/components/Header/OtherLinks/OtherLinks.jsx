import React from 'react';
import PropTypes from 'prop-types';

import DropdownLink from '../DropdownLink';

const links = [
  {
    href: '/collections',
    label: 'Data Collections',
  },
  {
    href: '/organ',
    label: 'Organs',
  },
  {
    href: '/publications',
    label: 'Publications',
  },
  {
    href: '/cells',
    label: 'Molecular Data Queries - BETA',
  },
];

function OtherLinks({ isIndented }) {
  return links.map(({ href, label }) => (
    <DropdownLink href={href} isIndented={isIndented}>
      {label}
    </DropdownLink>
  ));
}

OtherLinks.propTypes = {
  isIndented: PropTypes.bool,
};

OtherLinks.defaultProps = {
  isIndented: false,
};

export default OtherLinks;
