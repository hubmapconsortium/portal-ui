import React, { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';

import { PanelBox, LeftTextWrapper, TruncatedLink, TruncatedText, RightTextWrapper } from './style';

interface BasicPanelProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  secondaryText?: React.ReactNode;
  rightText?: React.ReactNode;
  noPadding?: boolean;
  noHover?: boolean;
  small?: boolean;
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
    return <PanelBox {...props} />;
  }

  const { title, href, secondaryText, rightText, icon, small, ...panelBoxProps } = props;

  const titleTextVariant = small ? 'subtitle2' : 'subtitle1';
  return (
    <PanelBox {...panelBoxProps}>
      <Stack spacing={2} direction="row" alignItems="center" maxWidth="100%">
        {icon}
        <LeftTextWrapper>
          <TruncatedLink variant={titleTextVariant} href={href} data-testid="panel-title">
            {title}
          </TruncatedLink>
          <TruncatedText variant="body2" color="secondary" data-testid="panel-secondary">
            {secondaryText}
          </TruncatedText>
        </LeftTextWrapper>
      </Stack>
      <RightTextWrapper data-testid="panel-right-text">{rightText}</RightTextWrapper>
    </PanelBox>
  );
}

export default Panel;
