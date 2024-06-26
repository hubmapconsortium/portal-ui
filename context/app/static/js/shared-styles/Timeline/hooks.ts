import { useState } from 'react';

export function useExpandableItems<T>(items: T[], expandable = false) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const handleExpand = () => setExpanded(true);
  // if the list is less than 3 items, show all items
  const listIsShort = items.length <= 3;
  // if the user has expanded the list or the list is not expandable, show all items
  const listIsExpanded = expanded || !expandable;
  if (listIsShort || listIsExpanded) {
    return { itemsToRender: items, isExpandable: false, isExpanded: true, handleExpand };
  }
  // Otherwise, show only the first 3 items
  return { itemsToRender: items.slice(0, 3), isExpandable: true, isExpanded: false, handleExpand };
}
