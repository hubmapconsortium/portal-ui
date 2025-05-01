import React, { useMemo, useRef } from 'react';
import { useEventCallback } from '@mui/material/utils';
import useTrackMount from 'js/hooks/useTrackMount';
import { useFlaskDataContext } from 'js/components/Contexts';
import { trackEvent } from 'js/helpers/trackers';
import { formatEventCategoryAndLabel, getNearestIdentifier, modifierKeys, mouseButtonMap } from './utils';

export function useVitessceEventMetadata() {
  const location = window.location.href;
  const flaskData = useFlaskDataContext();

  // Handle preview pages
  if (location.includes('preview')) {
    const { title } = flaskData;
    return formatEventCategoryAndLabel('Preview', title);
  }
  // Handle dataset/publication pages
  if (location.includes('browse')) {
    const {
      entity: { hubmap_id, entity_type },
    } = flaskData;
    return formatEventCategoryAndLabel(entity_type, hubmap_id);
  }
  // Handle biological entity pages
  if (location.includes('organ') || location.includes('genes') || location.includes('cell-type')) {
    const urlSegments = location.split('/');
    const entityName = urlSegments[urlSegments.length - 1];
    const entityType = urlSegments[urlSegments.length - 2];
    return formatEventCategoryAndLabel(entityType, entityName);
  }

  return formatEventCategoryAndLabel('Unknown', location);
}

const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export function useVisualizationTracker() {
  const { category, label } = useVitessceEventMetadata();
  // Track when the visualization is first mounted
  useTrackMount(category, 'Vitessce Mounted', label);
  const trackVitessceAction = useEventCallback((action) => {
    const event = { category, action, label };
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
    // Prevent default scrolling behavior of arrow keys
    if (arrowKeys.includes(key)) {
      trackVitessceAction(`${key} ${target}`);
      e.preventDefault();
    }
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
    // If the target is a canvas, the user is likely zooming; otherwise, scroll
    const action = (e.target as HTMLElement).tagName === 'CANVAS' ? 'Zoom' : 'Scroll';
    trackVitessceAction(`${action} ${direction} ${target}`);
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
