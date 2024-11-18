import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import LineClamp from 'js/shared-styles/text/LineClamp';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

interface LineClampWithTooltipProps extends PropsWithChildren {
  lines: number;
}

function LineClampWithTooltip({ lines, children }: LineClampWithTooltipProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Check whether the child text is truncated, and show the full text in a tooltip if so
  useEffect(() => {
    const element = ref.current;
    if (element) {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [children]);

  const content = (
    <LineClamp ref={ref} lines={lines}>
      {children}
    </LineClamp>
  );

  return isTruncated ? <SecondaryBackgroundTooltip title={children}>{content}</SecondaryBackgroundTooltip> : content;
}

export default LineClampWithTooltip;
