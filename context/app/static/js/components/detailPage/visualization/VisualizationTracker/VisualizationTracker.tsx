/* eslint-disable jsx-a11y/no-static-element-interactions */
import { trackEvent } from 'js/helpers/trackers';
import React, { PropsWithChildren, useCallback, useEffect } from 'react';

type VisualizationTrackerProps = PropsWithChildren;

// Titles of components in http://vitessce.io/docs/components/
const commonSections = [
  'Spatial Layers', // layerController
  'Spatial', // spatial
  'Scatterplot', // scatterplot
  'Description', // description
  'Data Set', // description alternative
  'Heatmap', // heatmap
  'Expression by Cell Set', // obsSetFeatureValueDistribution
  'Cell Sets', // obsSets
  'Gating', // gating
  'Genomic Profiles', // genomicProfiles
  'Expression Levels', // featureList
  'Antigen List', // featureList alternative
  'Cell Set Sizes', // obsSetSizes
  'Status', // status
  'Expression Histogram', // featureHistogram
];

// Common IDs to ignore
const ignoredIds = ['deckgl-overlay', 'view-ortho'];

function getNearestIdentifier(target: HTMLElement | null): string | null {
  if (!target) return null;
  // If the target has a useful ID, return it
  if (target.id && !ignoredIds.some((id) => target.id.includes(id))) return target.id;
  for (const section of commonSections) {
    if ('innerText' in target && target.innerText.includes(section)) return section;
  }
  return getNearestIdentifier(target.parentElement);
}

/**
 * Since `Vitessce` does not include native support for tracking,
 * wrapping it in a span and inferring the action based on the target is a workaround.
 */
export function VisualizationTracker({ children }: VisualizationTrackerProps) {
  // Track the mount event once per page
  const hasTrackedMount = React.useRef(false);
  useEffect(() => {
    if (!hasTrackedMount.current) {
      hasTrackedMount.current = true;
      trackEvent({
        category: 'Visualization',
        action: 'Visualization Mounted',
      });
    }
  }, []);

  const trackMouseEnter: React.MouseEventHandler<HTMLSpanElement> = useCallback((e) => {
    trackEvent({
      category: 'Visualization',
      action: 'Mouse Enter',
    });
  }, []);

  const trackMouseLeave: React.MouseEventHandler<HTMLSpanElement> = useCallback((e) => {
    trackEvent({
      category: 'Visualization',
      action: 'Mouse Leave',
    });
  }, []);

  const trackClick: React.MouseEventHandler<HTMLSpanElement> = useCallback((e) => {
    trackEvent({
      category: 'Visualization',
      action: 'Click',
      value: getNearestIdentifier(e.target as HTMLElement),
    });
  }, []);

  const trackMouseMove: React.MouseEventHandler<HTMLSpanElement> = useCallback((e) => {
    trackEvent({
      category: 'Visualization',
      action: 'Mouse Move',
      value: getNearestIdentifier(e.target as HTMLElement),
    });
  }, []);

  const trackKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = useCallback((e) => {
    trackEvent({
      category: 'Visualization',
      action: 'Key Down',
      value: getNearestIdentifier(e.target as HTMLElement),
    });
  }, []);

  return (
    <span
      onMouseEnter={trackMouseEnter}
      onMouseLeave={trackMouseLeave}
      onMouseMove={trackMouseMove}
      onClick={trackClick}
      onKeyDown={trackKeyDown}
    >
      {children}
    </span>
  );
}
