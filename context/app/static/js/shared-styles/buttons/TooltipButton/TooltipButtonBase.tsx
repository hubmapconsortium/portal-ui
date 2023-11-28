import React from 'react';
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

type WrapperButtonProps = { buttonComponent: typeof IconButton | typeof Button } & Omit<
  TooltipButtonBaseProps,
  'tooltip' | 'isIconButton'
>;

const WrappedButton = React.forwardRef(
  (
    { children, disabled, buttonComponent: ButtonComponent, ...props }: WrapperButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    if (disabled) {
      return (
        // TODO: Use Button Component.
        <span ref={ref}>
          <IconButton {...props} disabled>
            {children}
          </IconButton>
        </span>
      );
    }

    return (
      <IconButton {...props} ref={ref}>
        {children}
      </IconButton>
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
