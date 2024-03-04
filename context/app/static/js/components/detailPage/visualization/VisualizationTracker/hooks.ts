import React, { useMemo, useRef } from 'react';
import useTrackMount from 'js/hooks/useTrackMount';
import { useFlaskDataContext } from 'js/components/Contexts';
import { useEventCallback } from '@mui/material';
import { trackEvent } from 'js/helpers/trackers';
import { getNearestIdentifier, modifierKeys, mouseButtonMap } from './utils';

export function useVitessceEventMetadata() {
  const location = window.location.href;
  const flaskData = useFlaskDataContext();

  let category = 'Unknown';
  let name = location; // Fall back to the full URL if we can't find a better name

  // Handle preview pages
  if (location.includes('preview')) {
    const { title } = flaskData;
    category = 'Preview';
    name = title;
  }
  // Handle dataset/publication pages
  else if (location.includes('browse')) {
    const {
      entity: { hubmap_id, entity_type },
    } = flaskData;
    category = entity_type;
    name = hubmap_id;
  }
  // Handle biological entity pages
  else if (location.includes('organ') || location.includes('genes') || location.includes('cell-type')) {
    const urlSegments = location.split('/');
    name = urlSegments[urlSegments.length - 1];
    category = urlSegments[urlSegments.length - 2];
  }

  return { category: `Visualization - ${category}`, name };
}

export function useVisualizationTracker() {
  const { category, name } = useVitessceEventMetadata();
  // Track when the visualization is first mounted
  useTrackMount(category, 'Vitessce Mounted', name);
  const trackVitessceAction = useEventCallback((action) => {
    const event = { category, action, name };
    trackEvent(event);
  });

  // This set is used to track which targets have been hovered over
  // To avoid sending duplicate hover events
  const hoveredTargets = useRef<Set<string>>(new Set());

  // The ref for the span used to wrap the visualization
  const wrapper = useRef<HTMLSpanElement>(null);
  const typingTimeout = useRef<number | null>(null);

  const trackClick: React.MouseEventHandler<HTMLSpanElement> = useEventCallback((e) => {
    const target = getNearestIdentifier(e.target as HTMLElement);
    if (!target) return;
    const mouseButton = mouseButtonMap[e.button];
    trackVitessceAction(`${mouseButton} Click ${target}`);
  });

  const trackMouseMove: React.MouseEventHandler<HTMLSpanElement> = useEventCallback((e) => {
    const target = getNearestIdentifier(e.target as HTMLElement);
    if (!target || hoveredTargets.current.has(target)) return;
    hoveredTargets.current.add(target);
    trackVitessceAction(`Hover ${target}`);
  });

  const trackKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = useEventCallback((e) => {
    const target = getNearestIdentifier(e.target as HTMLElement);
    const key = e.key === ' ' ? 'Space' : e.key;
    if (!target || modifierKeys.includes(key)) return;
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = window.setTimeout(() => {
      trackVitessceAction(`Type ${(e.target as HTMLInputElement).value}, ${target}`);
    }, 5000);
  });

  const trackWheel: React.WheelEventHandler<HTMLSpanElement> = useEventCallback((e) => {
    const target = getNearestIdentifier(e.target as HTMLElement);
    if (!target) return;
    if (e.deltaY === 0) return;
    const direction = e.deltaY > 0 ? 'Out' : 'In';
    trackVitessceAction(`Zoom ${direction} ${target}`);
  });

  return useMemo(
    () => ({
      ref: wrapper,
      props: {
        onClick: trackClick,
        onMouseMove: trackMouseMove,
        onKeyDown: trackKeyDown,
        onWheel: trackWheel,
      },
    }),
    [wrapper, trackClick, trackMouseMove, trackKeyDown, trackWheel],
  );
}
