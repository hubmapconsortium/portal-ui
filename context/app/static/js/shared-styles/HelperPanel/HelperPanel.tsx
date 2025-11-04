import React, { PropsWithChildren } from 'react';
import { animated } from '@react-spring/web';
import Stack from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Fade from '@mui/material/Fade';

import { useIsLargeDesktop } from 'js/hooks/media-queries';
import { useAnimatedSidebarPosition } from 'js/shared-styles/sections/TableOfContents/hooks';
import { LineClampWithTooltip } from 'js/shared-styles/text';

import { HelperPanelPortal } from 'js/components/detailPage/DetailLayout/DetailLayout';
import { useTotalHeaderOffset } from 'js/components/detailPage/entityHeader/EntityHeader/hooks';

export function HelperPanelHeader({ children, ...rest }: TypographyProps) {
  return (
    <Typography variant="subtitle2" display="flex" alignItems="center" gap={0.5} whiteSpace="nowrap" {...rest}>
      {children}
    </Typography>
  );
}

interface HelperPanelBodyItemProps extends PropsWithChildren {
  label: string;
  noWrap?: boolean;
}

export function HelperPanelBodyItem({ label, children, noWrap }: HelperPanelBodyItemProps) {
  const body = noWrap ? <LineClampWithTooltip lines={3}>{children}</LineClampWithTooltip> : children;
  return (
    <Stack direction="column">
      <Typography variant="overline">{label}</Typography>
      <Typography variant="body2">{body}</Typography>
    </Stack>
  );
}

const AnimatedStack = animated(Stack);

interface HelperPanelProps extends PropsWithChildren {
  shouldDisplay?: boolean;
}

function useHelperPanelPosition() {
  const isDesktop = useIsLargeDesktop();
  const originalStyle = useAnimatedSidebarPosition();

  const headerOffset = useTotalHeaderOffset();

  if (!isDesktop || !originalStyle) {
    return originalStyle;
  }

  // For fixed positioning, we want to position relative to the viewport
  // Use the original horizontal positioning but set a fixed vertical position
  return {
    ...originalStyle,
    top: headerOffset + 24, // Fixed position from top of viewport (below header)
    // right: 20, // Fixed position from right edge
  };
}

export default function HelperPanelBase({ shouldDisplay, children }: HelperPanelProps) {
  const isDesktop = useIsLargeDesktop();
  const style = useHelperPanelPosition();

  return (
    <HelperPanelPortal>
      <Fade
        in={Boolean(shouldDisplay && isDesktop && style)}
        timeout={{
          appear: 300,
          enter: 300,
          exit: 0,
        }}
      >
        <AnimatedStack
          direction="column"
          maxWidth="12rem"
          padding={1}
          gap={1}
          bgcolor="secondaryContainer.main"
          boxShadow={2}
          style={style!}
          position="fixed"
          sx={{
            zIndex: 1000,
          }}
        >
          {children}
        </AnimatedStack>
      </Fade>
    </HelperPanelPortal>
  );
}
