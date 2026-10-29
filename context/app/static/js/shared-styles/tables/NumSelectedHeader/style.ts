import { styled } from '@mui/material/styles';
import { HTMLAttributes } from 'react';

export interface HeaderWrapperProps extends HTMLAttributes<HTMLDivElement> {
  $noBorderBottom?: boolean;
}

const HeaderWrapper = styled('div')<HeaderWrapperProps>(({ theme, $noBorderBottom = false }) => ({
  backgroundColor: theme.palette.white.main,
  backgroundImage: 'var(--Paper-overlay)', // sticky and opaque, so match the enclosing Paper's dark-mode overlay
  zIndex: theme.zIndex.fileBrowserHeader,
  borderBottom: $noBorderBottom ? 'unset' : `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0.75, 2),
  gap: theme.spacing(1),
  width: '100%',
  position: 'sticky',
  display: 'flex',
  top: 0,
}));

export { HeaderWrapper };
