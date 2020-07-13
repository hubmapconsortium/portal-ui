import React from 'react';
import PropTypes from 'prop-types';
import DropdownLink from '../DropdownLink';

function ShowcaseLinks(props) {
  const { isIndented } = props;
  return (
    <>
      {['Spraggins', 'Satija'].map((showcaseName) => (
        <DropdownLink key={showcaseName} href={`/showcase/${showcaseName.toLowerCase()}`} isIndented={isIndented}>
          {showcaseName}
        </DropdownLink>
      ))}
    </>
  );
}

ShowcaseLinks.propTypes = {
  isIndented: PropTypes.bool,
};

ShowcaseLinks.defaultProps = {
  isIndented: false,
};

export default React.memo(ShowcaseLinks);
