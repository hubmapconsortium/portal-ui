import React from 'react';
import PropTypes from 'prop-types';
import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';

function ResourceLinks(props) {
  const { isIndented } = props;
  return (
    <>
      <DropdownLink href="https://software.docs.hubmapconsortium.org/technical" isIndented={isIndented}>
        Technical Documentation
      </DropdownLink>
      <DropdownLink href="https://software.docs.hubmapconsortium.org/faq" isIndented={isIndented}>
        FAQ
      </DropdownLink>
      <DropdownLink href="https://software.docs.hubmapconsortium.org/about" isIndented={isIndented}>
        About
      </DropdownLink>
      <StyledDivider />
      {['Multimodal Molecular Imaging Data', 'Cell Type Annotations', 'Liver Map'].map((previewName) => (
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
