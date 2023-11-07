import hasKey from 'js/helpers/hasKey';
import { MutableRefObject } from 'react';
import { trackEvent } from 'js/helpers/trackers';
import { VitessceInteraction } from './types';

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
  // If the target has a title, return it (e.g. button controls)
  if (target.title) {
    // Remove excessive whitespace from the title
    return target.title.replace(/\s+/g, ' ');
  }
  for (const component of visualizationComponents) {
    if ('innerText' in target && target.innerText.includes(component)) return component;
  }
  return getNearestIdentifier(target.parentElement);
}

/**
 * Convert an array of Vitessce interactions to a string.
 * @param interaction
 * @returns A string representation of the interaction.
 */
export function stringifyVitessceInteraction(interaction: VitessceInteraction) {
  return interaction.map(([action, target, value]) => `${action} ${target}${value ? ` ${value}` : ''}`).join(' > ');
}

/**
 * Get the last interaction in an array of Vitessce interactions.
 * @param interaction
 * @returns The last interaction in the array, or null if the array is empty.
 */
export function getLastInteraction(interaction: VitessceInteraction) {
  if (interaction.length === 0) return null;
  return interaction[interaction.length - 1];
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

// Fire event 5 seconds after last interaction with the visualization
const INTERACTION_TIMEOUT_INTERVAL = 5000;

export function fireVitessceEvent(ref: MutableRefObject<VitessceInteraction>) {
  if (ref.current.length > 0) {
    trackEvent({
      category: 'Visualization',
      action: 'Interaction',
      value: stringifyVitessceInteraction(ref.current),
    });
    // Clear the interaction object after logging event
    ref.current = [];
  }
}

export function pushVitessceEvent(
  interactionRef: MutableRefObject<VitessceInteraction>,
  interaction: VitessceInteraction[number],
  timeoutRef: MutableRefObject<number | null>,
) {
  interactionRef.current.push(interaction);
  timeoutRef.current = window.setTimeout(() => {
    fireVitessceEvent(interactionRef);
  }, INTERACTION_TIMEOUT_INTERVAL);
}

export function handleKeyPress(
  key: string,
  interactionRef: MutableRefObject<VitessceInteraction>,
  target: string,
): VitessceInteraction[number] {
  const lastInteraction = getLastInteraction(interactionRef.current);
  switch (key) {
    case 'Tab': {
      return ['TabFocus', target];
    }
    // Treat enter/space as a click
    case 'Enter':
    case 'Space':
      return ['Click', target, key];
    default: {
      if (lastInteraction) {
        const [lastAction, lastTarget] = lastInteraction;
        // If the last action was a keypress on the same target, append the key to the recorded value
        // This means the user is likely typing in a text field
        if (lastAction === 'Keypress' && lastTarget === target) {
          const interaction = interactionRef.current.pop();
          if (!interaction || interaction.length !== 3) throw new Error('Invalid keypress interaction');
          interaction[2] = `${interaction[2]}${key}`;
          return interaction;
        }
      }
      return ['Keypress', target, key];
    }
  }
}
