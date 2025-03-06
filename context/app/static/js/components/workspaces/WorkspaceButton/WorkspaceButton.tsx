import React from 'react';
import { Theme, styled } from '@mui/material/styles';
import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import Button from '@mui/material/Button';

const sharedButtonStyles = (theme: Theme) => ({
  backgroundColor: theme.palette.white.main,
  color: theme.palette.primary.main,
  borderRadius: theme.spacing(0.5),
  border: `1px solid ${theme.palette.divider}`,
});

const WorkspaceTooltipButton = styled((props: React.ComponentProps<typeof TooltipIconButton>) => (
  <TooltipIconButton size="small" {...props} />
))(({ theme }) => ({
  ...sharedButtonStyles(theme),
  svg: {
    fontSize: '1.25rem',
  },
}));

const WorkspaceButton = styled(Button)(({ theme }) => ({
  ...sharedButtonStyles(theme),
  padding: theme.spacing(0.75, 2),
}));

export { WorkspaceTooltipButton, WorkspaceButton };
