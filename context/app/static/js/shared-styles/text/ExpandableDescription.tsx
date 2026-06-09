import React, { useEffect, useRef, useState } from 'react';
import { LineClamp } from 'js/shared-styles/text';

interface ExpandableDescriptionProps {
  description?: string;
  /** Expanded state is owned by the parent so the surrounding row can grow to fit the full text. */
  expanded: boolean;
  onToggle: () => void;
  lines?: number;
  color?: string;
}

/**
 * A description clamped to `lines` (default 2) that expands to its full text on click. It is only
 * interactive when there is a real description that actually overflows when clamped (detected the
 * same way as LineClampWithTooltip). Used by the cell types and biomarker landing panels.
 */
export default function ExpandableDescription({
  description,
  expanded,
  onToggle,
  lines = 2,
  color = 'text.secondary',
}: ExpandableDescriptionProps) {
  const text = description || 'No description available.';
  const hasDescription = Boolean(description);
  const ref = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (element && !expanded) {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [text, expanded]);

  const canExpand = hasDescription && (isTruncated || expanded);

  return (
    <LineClamp
      ref={ref}
      color={color}
      // A large clamp value effectively removes the clamp when expanded (shows all lines).
      lines={expanded ? 99 : lines}
      role={canExpand ? 'button' : undefined}
      tabIndex={canExpand ? 0 : undefined}
      aria-expanded={canExpand ? expanded : undefined}
      onClick={canExpand ? onToggle : undefined}
      onKeyDown={
        canExpand
          ? (event: React.KeyboardEvent) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onToggle();
              }
            }
          : undefined
      }
      sx={{ cursor: canExpand ? 'pointer' : 'default' }}
    >
      {text}
    </LineClamp>
  );
}
