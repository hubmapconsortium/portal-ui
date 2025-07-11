import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack, { StackProps } from '@mui/material/Stack';
import { useIsMobile } from 'js/hooks/media-queries';
import { PanelProps } from 'js/shared-styles/panels/Panel';

const mobileStackProps: Partial<StackProps> = {
  height: '100%',
  direction: 'column',
  spacing: 2,
  py: 2,
};

const desktopStackProps: Partial<StackProps> = {
  height: 52,
  direction: 'row',
  spacing: 4,
  py: 0,
};

export function StackTemplate(props: React.ComponentProps<typeof Stack>) {
  const isMobile = useIsMobile();
  const responsiveProps = isMobile ? mobileStackProps : desktopStackProps;
  return <Stack marginX={2} marginY={1} useFlexGap width="100%" {...responsiveProps} {...props} />;
}

export function MobileLabel({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return null;
  }
  return (
    <Typography component="label" width="33%" flexShrink={0} pr={2}>
      {children}
    </Typography>
  );
}

export function BodyCell({ children, ...props }: React.ComponentProps<typeof Box>) {
  const ariaLabel = props['aria-label'];
  return (
    <Box display="flex" alignItems="center" {...props}>
      <MobileLabel>{ariaLabel}</MobileLabel>
      {children}
    </Box>
  );
}

export function HeaderCell({ children, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <BodyCell {...props}>
      <Typography variant="subtitle2">{children}</Typography>
    </BodyCell>
  );
}

export const skeletons: PanelProps[] = Array.from({ length: 10 }).map((_, index) => ({
  key: `skeleton-${index}`,
  children: <Skeleton width="100%" height={32} variant="rounded" key={Math.random()} />,
}));
