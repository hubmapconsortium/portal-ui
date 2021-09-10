import React from 'react';

import { StyledButton } from './style';

function DownloadButton(props) {
  const { type } = props;
  const lcPluralType = `${type.toLowerCase()}s`;
  return (
    <StyledButton href={`/api/v0/${lcPluralType}.tsv`} target="_blank" component="a">
      Download Metadata
    </StyledButton>
  );
}

export default DownloadButton;
