import React, { forwardRef, Ref } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useIsMobile } from 'js/hooks/media-queries';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

interface HeaderButtonProps {
  title: string;
  altOnlyTitle?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  tooltip?: string;
}

function HeaderButton({ title, onClick, altOnlyTitle, icon, tooltip }: HeaderButtonProps, ref: Ref<HTMLButtonElement>) {
  const isMobile = useIsMobile();
  const showTitle = !isMobile && !altOnlyTitle;

  const commonProps = {
    'aria-label': title,
    ref,
    onClick,
    style: { color: 'white' },
  };

  const button = showTitle ? (
    <Button startIcon={icon} {...commonProps}>
      {title}
    </Button>
  ) : (
    <IconButton {...commonProps}>{icon}</IconButton>
  );

  if (tooltip) {
    return <SecondaryBackgroundTooltip title={tooltip}>{button}</SecondaryBackgroundTooltip>;
  }

  return button;
}

export default forwardRef(HeaderButton);
