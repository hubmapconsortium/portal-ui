import React, { ElementType } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { TooltipProps } from '@mui/material/Tooltip';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

type TooltipButtonBaseProps = (
  | ({
      isIconButton: true;
      tooltip: React.ReactNode;
    } & IconButtonProps)
  | ({
      isIconButton: false;
      tooltip: React.ReactNode;
    } & ButtonProps)
) &
  Pick<TooltipProps, 'placement'>;

type WrapperButtonProps = {
  buttonComponent: ElementType;
  ref?: React.Ref<HTMLButtonElement>;
} & Omit<TooltipButtonBaseProps, 'tooltip' | 'isIconButton'>;

function WrappedButton({ children, disabled, buttonComponent: ButtonComponent, ref, ...props }: WrapperButtonProps) {
  if (disabled) {
    const { onMouseLeave, onMouseEnter, onMouseMove, onMouseOver, ...restProps } = props;
    const eventProps = {
      onMouseLeave,
      onMouseEnter,
      onMouseMove,
      onMouseOver,
    };
    return (
      <span ref={ref} {...eventProps}>
        <ButtonComponent {...restProps} disabled>
          {children}
        </ButtonComponent>
      </span>
    );
  }

  return (
    <ButtonComponent {...props} ref={ref}>
      {children}
    </ButtonComponent>
  );
}

function TooltipButtonBase({
  tooltip,
  placement,
  children,
  component,
  isIconButton,
  ref,
  ...props
}: TooltipButtonBaseProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <SecondaryBackgroundTooltip describeChild title={tooltip} placement={placement}>
      <WrappedButton {...props} buttonComponent={isIconButton ? IconButton : Button} ref={ref}>
        {children}
      </WrappedButton>
    </SecondaryBackgroundTooltip>
  );
}

export default TooltipButtonBase;
