import React, { ElementType } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

type TooltipButtonBaseProps =
  | ({
      isIconButton: true;
      tooltip: React.ReactNode;
    } & IconButtonProps)
  | ({
      isIconButton: false;
      tooltip: React.ReactNode;
    } & ButtonProps);

type WrapperButtonProps = { buttonComponent: ElementType } & Omit<TooltipButtonBaseProps, 'tooltip' | 'isIconButton'>;

const WrappedButton = React.forwardRef(
  (
    { children, disabled, buttonComponent: ButtonComponent, ...props }: WrapperButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
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
  },
);

function TooltipButtonBase(
  { tooltip, children, component, isIconButton, ...props }: TooltipButtonBaseProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <SecondaryBackgroundTooltip describeChild title={tooltip}>
      <WrappedButton {...props} buttonComponent={isIconButton ? IconButton : Button} ref={ref}>
        {children}
      </WrappedButton>
    </SecondaryBackgroundTooltip>
  );
}

export default React.forwardRef(TooltipButtonBase);
