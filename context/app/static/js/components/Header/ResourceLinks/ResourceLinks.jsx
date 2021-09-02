import React from 'react';
import PropTypes from 'prop-types';
import DropdownLink from '../DropdownLink';

function ResourceLinks(props) {
  const { isIndented } = props;
  return (
    <>
      {['Multimodal Molecular Imaging Data', 'Cell Type Annotations'].map((previewName) => (
        <DropdownLink
          key={previewName}
          href={`/preview/${previewName.toLowerCase().replace(/\W+/g, '-')}`}
          isIndented={isIndented}
        >
          Preview: {previewName}
        </DropdownLink>
      ))}
    </>
  );
}

ResourceLinks.propTypes = {
  isIndented: PropTypes.bool,
};

ResourceLinks.defaultProps = {
  isIndented: false,
};

export default React.memo(ResourceLinks);
