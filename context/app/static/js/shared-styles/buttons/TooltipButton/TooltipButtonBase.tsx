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
    // When wrapping a disabled button so the Tooltip's hover/focus still fires,
    // the <span> is the element MUI's Tooltip tracks via ref. The Tooltip's
    // hover handlers AND its internal "this is a cloned tooltip child" marker
    // must therefore live on the span -- otherwise MUI's dev-only check
    // (childNode.getAttribute('data-mui-internal-clone-element')) misses it
    // and logs "the children component of the Tooltip is not forwarding its
    // props correctly". The remaining props (className from styled wrappers,
    // sx, onClick, aria-*, etc.) stay on the inner <button> so styles and
    // semantics work as intended.
    const {
      onMouseLeave,
      onMouseEnter,
      onMouseMove,
      onMouseOver,
      'data-mui-internal-clone-element': dataMuiCloneElement,
      ...restProps
    } = props as WrapperButtonProps & { 'data-mui-internal-clone-element'?: boolean };
    // The span is not itself interactive (it's a passive wrapper so MUI
    // Tooltip can attach hover listeners to a disabled button); the focus
    // pairing for these mouse events would have to live on the inner
    // disabled <button>, which can't receive focus anyway.
    return (
      <span
        ref={ref}
        data-mui-internal-clone-element={dataMuiCloneElement}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        onMouseOver={onMouseOver}
      >
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
