import React, { PropsWithChildren } from 'react';

import { PanelBox, LeftTextWrapper, TruncatedLink, TruncatedText, RightTextWrapper } from './style';

interface BasicPanelProps {
  title: string;
  href: string;
  secondaryText?: React.ReactNode;
  rightText?: React.ReactNode;
}

interface CustomPanelProps extends PropsWithChildren {
  noPadding?: boolean;
  noHover?: boolean;
  key: string;
}

export type PanelProps = BasicPanelProps | CustomPanelProps;

function isCustomPanel(props: PanelProps): props is CustomPanelProps {
  return 'children' in props;
}

function Panel(props: PanelProps) {
  if (isCustomPanel(props)) {
    return <PanelBox {...props}/>;
  }

  const { title, href, secondaryText, rightText } = props;
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
