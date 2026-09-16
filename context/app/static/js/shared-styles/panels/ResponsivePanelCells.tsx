import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack, { StackProps } from '@mui/material/Stack';
import { useIsMobile } from 'js/hooks/media-queries';
import { PanelProps } from 'js/shared-styles/panels/Panel';
import { mergeSx } from 'js/helpers/styled';

const mobileStackProps: Partial<StackProps> = {
  direction: 'column',
  spacing: 2,
};

const desktopStackProps: Partial<StackProps> = {
  direction: 'row',
  spacing: 4,
};

export function StackTemplate(props: React.ComponentProps<typeof Stack>) {
  const isMobile = useIsMobile();
  const responsiveProps = isMobile ? mobileStackProps : desktopStackProps;
  return (
    <Stack
      useFlexGap
      {...responsiveProps}
      {...props}
      sx={mergeSx(
        {
          marginX: 2,
          marginY: 1,
          width: '100%',
        },
        isMobile ? { height: '100%', py: 2 } : { height: 52, py: 0 },
        props.sx,
      )}
    />
  );
}

export function MobileLabel({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return null;
  }
  return (
    <Typography
      component="label"
      sx={{
        width: '33%',
        flexShrink: 0,
        pr: 2,
      }}
    >
      {children}
    </Typography>
  );
}

interface BodyCellProps extends React.ComponentProps<typeof Box> {
  hideMobileLabel?: boolean;
}

export function BodyCell({ children, hideMobileLabel, ...props }: BodyCellProps) {
  const ariaLabel = props['aria-label'];
  return (
    <Box
      {...props}
      sx={mergeSx(
        {
          display: 'flex',
          alignItems: 'center',
        },
        props.sx,
      )}
    >
      {!hideMobileLabel && <MobileLabel>{ariaLabel}</MobileLabel>}
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
  panelKey: `skeleton-${index}`,
  children: <Skeleton width="100%" height={32} variant="rounded" />,
}));
