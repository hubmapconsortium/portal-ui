import React, { ComponentProps } from 'react';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { InlineBlockSpan } from './style';

function DisabledButtonTooltip({ children, ...rest }: ComponentProps<typeof SecondaryBackgroundTooltip>) {
  return (
    <SecondaryBackgroundTooltip {...rest}>
      <InlineBlockSpan>{children}</InlineBlockSpan>
    </SecondaryBackgroundTooltip>
  );
}
export default DisabledButtonTooltip;
