import React, { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import Hidden from '@mui/material/Hidden';
import { PanelBox, LeftTextWrapper, TruncatedLink, TruncatedText, RightTextWrapper } from './style';

interface BasicPanelProps {
  title: string;
  href: string;
  onClick?: () => void;
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
      {icon && (
        <Box pr={2} flexShrink={0} my="auto">
          {icon}
        </Box>
      )}
      <LeftTextWrapper>
        <TruncatedLink variant={titleTextVariant} href={href} data-testid="panel-title">
          {title}
        </TruncatedLink>
        <TruncatedText variant="body2" color="secondary" data-testid="panel-secondary">
          {secondaryText}
        </TruncatedText>
        <Hidden mdUp>
          {/* This workaround keeps icons lined up with the rest of the text
              while allowing the truncation to continue working at all sizes */}
          <TruncatedText variant="body2" color="secondary" data-testid="panel-secondary-right-text">
            {rightText}
          </TruncatedText>
        </Hidden>
      </LeftTextWrapper>
      <RightTextWrapper data-testid="panel-right-text">{rightText}</RightTextWrapper>
    </PanelBox>
  );
}

export default Panel;
