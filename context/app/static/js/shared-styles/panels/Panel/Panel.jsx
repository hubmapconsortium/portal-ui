import React from 'react';

import { PanelBox, LeftTextWrapper, TruncatedLink, TruncatedText, RightTextWrapper } from './style';

function Panel({ title, href, secondaryText, rightText }) {
  return (
    <PanelBox>
      <LeftTextWrapper>
        <TruncatedLink variant="subtitle1" href={href} data-testid="panel-title">
          {title}
        </TruncatedLink>
        <TruncatedText variant="body2" color="secondary" data-testid="panel-secondary">
          {secondaryText}
        </TruncatedText>
      </LeftTextWrapper>
      <RightTextWrapper data-testid="panel-right-text">{rightText}</RightTextWrapper>
    </PanelBox>
  );
}

export default Panel;
