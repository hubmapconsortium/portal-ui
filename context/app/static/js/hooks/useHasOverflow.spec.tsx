import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import useHasOverflow, { SINGLE_ROW_HEIGHT } from './useHasOverflow';

let contentHeight = 0;

beforeEach(() => {
  vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(() => contentHeight);
  vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(function clientHeight(this: Element) {
    // Models `maxHeight: isExpanded ? 'none' : SINGLE_ROW_HEIGHT`.
    return (this as HTMLElement).dataset.expanded === 'true'
      ? contentHeight
      : Math.min(contentHeight, SINGLE_ROW_HEIGHT);
  });
});

afterEach(() => vi.restoreAllMocks());

function Harness() {
  const { containerRef, isExpanded, setIsExpanded, hasOverflow } = useHasOverflow(true, [contentHeight]);
  return (
    <>
      <div ref={containerRef} data-expanded={String(isExpanded)} />
      <button type="button" onClick={() => setIsExpanded((prev) => !prev)}>
        toggle
      </button>
      <span data-testid="overflow">{String(hasOverflow)}</span>
    </>
  );
}

const overflow = () => screen.getByTestId('overflow').textContent;

test('ignores sub-pixel rounding, reports a real extra row, and re-measures on collapse', () => {
  contentHeight = SINGLE_ROW_HEIGHT + 1; // one row, rounded up a pixel
  const { unmount } = render(<Harness />);
  expect(overflow()).toBe('false');
  unmount();

  contentHeight = SINGLE_ROW_HEIGHT * 2; // a genuine second row
  render(<Harness />);
  expect(overflow()).toBe('true');

  fireEvent.click(screen.getByRole('button')); // expanded: nothing is clipped
  expect(overflow()).toBe('false');

  fireEvent.click(screen.getByRole('button')); // collapsed: the toggle must return
  expect(overflow()).toBe('true');
});
