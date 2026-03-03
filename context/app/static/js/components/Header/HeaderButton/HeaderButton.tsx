import React, { forwardRef, Ref } from 'react';

import { useIsMobile } from 'js/hooks/media-queries';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledHeaderButton, StyledHeaderIconButton } from './styles';

interface HeaderButtonProps {
  title: string;
  altOnlyTitle?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  tooltip?: string;
  'data-testid'?: string;
  disableTextTransform?: boolean;
}

function HeaderButton(
  { title, onClick, altOnlyTitle, icon, tooltip, 'data-testid': testId, disableTextTransform }: HeaderButtonProps,
  ref: Ref<HTMLButtonElement>,
) {
  const isMobile = useIsMobile();
  const showTitle = !isMobile && !altOnlyTitle;

  const commonProps = {
    'aria-label': title,
    ref,
    onClick,
    'data-testid': testId,
  };

  const button = showTitle ? (
    <StyledHeaderButton startIcon={icon} $disableTextTransform={disableTextTransform} {...commonProps}>
      {title}
    </StyledHeaderButton>
  ) : (
    <StyledHeaderIconButton {...commonProps}>{icon}</StyledHeaderIconButton>
  );

  if (tooltip) {
    return <SecondaryBackgroundTooltip title={tooltip}>{button}</SecondaryBackgroundTooltip>;
  }

  return button;
}

export default forwardRef(HeaderButton);
