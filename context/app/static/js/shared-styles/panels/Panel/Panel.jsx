import React from 'react';

import { PanelBox, LeftTextWrapper, TruncatedLink, TruncatedText, RightTextWrapper } from './style';

function Panel({ title, href, secondaryText, rightText }) {
  return (
    <PanelBox>
      <LeftTextWrapper>
        <TruncatedLink variant="subtitle1" href={href}>
          {title}
        </TruncatedLink>
        <TruncatedText variant="body2" color="secondary">
          {secondaryText}
        </TruncatedText>
      </LeftTextWrapper>
      <RightTextWrapper>{rightText}</RightTextWrapper>
    </PanelBox>
  );
}

export default Panel;
