import React from 'react';
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

export default React.memo(ShowcaseLinks);
