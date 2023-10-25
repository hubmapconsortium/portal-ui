/* eslint-disable jsx-a11y/no-static-element-interactions */
import { trackEvent } from 'js/helpers/trackers';
import React, { PropsWithChildren, useCallback, useRef } from 'react';
import useTrackMount from 'js/hooks/useTrackMount';
import { VitessceInteraction } from './types';
import {
  getLastInteraction,
  getNearestIdentifier,
  modifierKeys,
  mouseButtonMap,
  stringifyVitessceInteraction,
} from './utils';

type VisualizationTrackerProps = PropsWithChildren;

type FocusAndMouseHandler = React.MouseEventHandler<HTMLSpanElement> & React.FocusEventHandler<HTMLSpanElement>;

/**
 * Since `Vitessce` does not include native support for tracking,
 * wrapping it in a span and inferring the action based on the target is a workaround.
 */
function VisualizationTracker({ children }: VisualizationTrackerProps) {
  // Track when the visualization is mounted
  useTrackMount('Visualization', 'Vitessce Mounted');

  // Create an object to track Vitessce interactions
  // This approach creates a digest of the user's interaction with the visualization
  // A ref is used to avoid triggering a re-render when the interaction object is updated
  // The ref is cleared when the user leaves the visualization
  const vitessceInteraction = useRef<VitessceInteraction>([]);

  const wrapper = useRef<HTMLSpanElement>(null);

  const trackEnter: FocusAndMouseHandler = useCallback((_e) => {
    // trackEvent({
    //   category: 'Visualization',
    //   action: 'Mouse Enter',
    // });
    // console.log('enter', e);
    // TODO: using an interval to track when the user has stopped interacting with the visualization
    // would be a better approach than firing trackEvent on mouse leave, since dragging the
    // visualization to pan it triggers mouse leave events
  }, []);

  const trackLeave: FocusAndMouseHandler = useCallback((e) => {
    // trackEvent({
    //   category: 'Visualization',
    //   action: 'Mouse Leave',
    // });

    // Confirm that the user didn't click on a child element within the visualization
    if (
      e.relatedTarget &&
      wrapper.current &&
      // confirm that the related target is an element before using `.contains` to avoid runtime errors
      e.relatedTarget instanceof Element &&
      wrapper.current.contains(e.relatedTarget as Node)
    ) {
      return;
    }
    if (vitessceInteraction.current.length > 0) {
      trackEvent({
        category: 'Visualization',
        action: 'Interaction',
        value: stringifyVitessceInteraction(vitessceInteraction.current),
      });
      // Clear the interaction object after logging event
      vitessceInteraction.current = [];
    }
  }, []);

  const trackClick: React.MouseEventHandler<HTMLSpanElement> = useCallback((e) => {
    const target = getNearestIdentifier(e.target as HTMLElement);
    if (!target) return;
    vitessceInteraction.current.push(['Click', target, mouseButtonMap[e.button]]);
  }, []);

  const trackMouseMove: React.MouseEventHandler<HTMLSpanElement> = useCallback((e) => {
    // trackEvent({
    //   category: 'Visualization',
    //   action: 'Mouse Move',
    //   value: getNearestIdentifier(e.target as HTMLElement),
    // });
    const target = getNearestIdentifier(e.target as HTMLElement);
    if (!target) return;
    // Deduplicate hover events to prevent spamming the event log
    const lastInteraction = getLastInteraction(vitessceInteraction.current);
    if (lastInteraction) {
      const [lastAction, lastTarget] = lastInteraction;
      if (lastAction === 'Hover' && lastTarget === target) return;
    }
    vitessceInteraction.current.push(['Hover', target]);
  }, []);

  const trackKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = useCallback((e) => {
    // trackEvent({
    //   category: 'Visualization',
    //   action: 'Key Down',
    //   value: getNearestIdentifier(e.target as HTMLElement),
    // });
    const target = getNearestIdentifier(e.target as HTMLElement);
    const key = e.key === ' ' ? 'Space' : e.key;
    if (!target || modifierKeys.includes(key)) return;
    const lastInteraction = getLastInteraction(vitessceInteraction.current);
    switch (key) {
      case 'Tab': {
        vitessceInteraction.current.push(['TabFocus', target]);
        break;
      }
      // Treat enter/space as a click
      case 'Enter':
      case 'Space':
        vitessceInteraction.current.push(['Click', target, key]);
        break;
      default: {
        if (lastInteraction) {
          const [lastAction, lastTarget] = lastInteraction;
          // If the last action was a keypress on the same target, append the key to the recorded value - user is typing
          if (lastAction === 'Keypress' && lastTarget === target) {
            vitessceInteraction.current[vitessceInteraction.current.length - 1] = [
              'Keypress',
              target,
              `${lastInteraction[2]}${key}`,
            ];
          }
        } else {
          vitessceInteraction.current.push(['Keypress', target, key]);
        }
      }
    }
  }, []);

  const trackWheel: React.WheelEventHandler<HTMLSpanElement> = useCallback((e) => {
    trackEvent({
      category: 'Visualization',
      action: `Zoom ${e.deltaY > 0 ? 'Out' : 'In'}`,
      value: getNearestIdentifier(e.target as HTMLElement),
    });
  }, []);

  return (
    <span
      ref={wrapper}
      onMouseEnter={trackEnter}
      onFocus={trackEnter}
      onMouseLeave={trackLeave}
      onBlur={trackLeave}
      onMouseMove={trackMouseMove}
      onClick={trackClick}
      onKeyDown={trackKeyDown}
      onWheel={trackWheel}
    >
      {children}
    </span>
  );
}

export default VisualizationTracker;
