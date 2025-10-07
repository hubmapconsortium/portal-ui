import hasKey from 'js/helpers/hasKey';

/**
 * Titles of components in the Vitessce UI
 * @see https://vitessce.io/docs/components/
 */
const visualizationComponents = [
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

/**
 * Retrieves the most relevant human-readable identifier for a given element.
 * @param target The target element.
 * @returns The title or component name that most accurately describes the current target.
 */
export function getNearestIdentifier(target: HTMLElement | null): string | null {
  if (!target) return null;
  // Since these can be empty strings, use the logical OR operator to select the first non-empty value
  // instead of the nullish coalescing operator

  const label = target.ariaLabel || target.title || target.innerText || (target as HTMLInputElement)?.placeholder || '';
  switch (target.localName) {
    case 'a':
    case 'button':
    case 'select':
      return label;
    case 'input':
      if ((target as HTMLInputElement)?.type === 'checkbox') {
        return `Toggle ${label}`;
      }
      return label;
    default:
      // If the target has a title, return it (e.g. button controls)
      if (target.title) {
        // Remove excessive whitespace from the title
        return target.title.replace(/\s+/g, ' ');
      }
      return (
        visualizationComponents.find((component) => 'innerText' in target && target.innerText.includes(component)) ??
        getNearestIdentifier(target.parentElement)
      );
  }
}

/**
 * List of modifier keys captured by the KeyboardEvent.key property.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#modifier_keys
 */
export const modifierKeys = [
  'Alt',
  'AltGraph',
  'CapsLock',
  'Control',
  'Fn',
  'FnLock',
  'Hyper',
  'Meta',
  'NumLock',
  'ScrollLock',
  'Shift',
  'Super',
  'Symbol',
  'SymbolLock',
];

const knownButtonMap: Record<number, string> = {
  0: 'Left',
  1: 'Middle',
  2: 'Right',
};

/**
 * Map mouse button numbers to names.
 * Given that mouse buttons 3 and above are not standardized,
 * only map the first three buttons and use a Proxy to return a default value for the rest.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
 */
export const mouseButtonMap = new Proxy(knownButtonMap, {
  get: (target, key) => {
    return hasKey(target, key) ? target[key] : `Unknown (${String(key)})`;
  },
});

/**
 * Helper function for `useVisualizationTracker` to format the category and label for an event.
 * @param category
 * @param label
 * @returns
 */
export const formatEventCategoryAndLabel = (category: string, label: string) => {
  return {
    category: `Visualization - ${category}`,
    label,
  };
};
