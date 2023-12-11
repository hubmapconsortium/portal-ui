import React, { useCallback, useRef } from 'react';
import useTrackMount from 'js/hooks/useTrackMount';
import { VitessceInteraction } from './types';
import {
  getLastInteraction,
  getNearestIdentifier,
  handleKeyPress,
  modifierKeys,
  mouseButtonMap,
  pushVitessceEvent,
} from './utils';

type FocusAndMouseHandler = React.MouseEventHandler<HTMLSpanElement> & React.FocusEventHandler<HTMLSpanElement>;

export const useVisualizationTracker = () => {
  // Track when the visualization is first mounted
  useTrackMount('Visualization', 'Vitessce Mounted');
  // Create an object to track Vitessce interactions
  // This list is populated with a summary of every interaction a user has with the visualization
  const vitessceInteraction = useRef<VitessceInteraction>([]);

  // This timeout is used to send the interaction object to the event log after a period of inactivity
  const interactionTimeout = useRef<number | null>(null);

  // This helper is also defined as a ref to avoid re-rendering/dependency array inclusion.
  // The `push` function is used to add an interaction to the interaction object
  // and queue up/reset the timeout to send the interaction object to the event log
  // and clear the interaction object.
  const push = useRef((event: VitessceInteraction[number]) => {
    pushVitessceEvent(vitessceInteraction, event, interactionTimeout);
  });

  // The ref for the span used to wrap the visualization
  const wrapper = useRef<HTMLSpanElement>(null);

  const trackEnter: FocusAndMouseHandler = useCallback((e) => {
    const target = getNearestIdentifier(e.target as HTMLElement);
    if (!target) return;
    push.current(['Enter', target]);
  }, []);

  const trackLeave: FocusAndMouseHandler = useCallback((e) => {
    const target = getNearestIdentifier(e.target as HTMLElement);
    if (!target) return;
    push.current(['Leave', target]);
  }, []);

  const trackClick: React.MouseEventHandler<HTMLSpanElement> = useCallback((e) => {
    const target = getNearestIdentifier(e.target as HTMLElement);
    if (!target) return;
    push.current(['Click', target, mouseButtonMap[e.button]]);
  }, []);

  const trackMouseMove: React.MouseEventHandler<HTMLSpanElement> = useCallback((e) => {
    const target = getNearestIdentifier(e.target as HTMLElement);
    if (!target) return;

    // Deduplicate hover events to prevent spamming the event log
    const lastInteraction = getLastInteraction(vitessceInteraction.current);
    if (lastInteraction) {
      const [lastAction, lastTarget] = lastInteraction;
      if (lastAction === 'Hover' && lastTarget === target) return;
    }

    push.current(['Hover', target]);
  }, []);

  const trackKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = useCallback((e) => {
    const target = getNearestIdentifier(e.target as HTMLElement);
    const key = e.key === ' ' ? 'Space' : e.key;
    if (!target || modifierKeys.includes(key)) return;
    push.current(handleKeyPress(key, vitessceInteraction, target));
  }, []);

  const trackWheel: React.WheelEventHandler<HTMLSpanElement> = useCallback((e) => {
    push.current(['Zoom', getNearestIdentifier(e.target as HTMLElement) ?? 'Unknown']);
  }, []);

  return {
    ref: wrapper,
    props: {
      onMouseEnter: trackEnter,
      onMouseLeave: trackLeave,
      onClick: trackClick,
      onMouseMove: trackMouseMove,
      onKeyDown: trackKeyDown,
      onWheel: trackWheel,
    },
  };
};
