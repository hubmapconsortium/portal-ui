import React from 'react';
import PropTypes from 'prop-types';
import DropdownLink from '../DropdownLink';

function PreviewLinks(props) {
  const { isIndented } = props;
  return (
    <>
      {['Spraggins', 'Satija'].map((previewName) => (
        <DropdownLink key={previewName} href={`/preview/${previewName.toLowerCase()}`} isIndented={isIndented}>
          {previewName}
        </DropdownLink>
      ))}
    </>
  );
}

PreviewLinks.propTypes = {
  isIndented: PropTypes.bool,
};

PreviewLinks.defaultProps = {
  isIndented: false,
};

export default React.memo(PreviewLinks);
