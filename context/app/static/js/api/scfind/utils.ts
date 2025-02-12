import { AnnotationNamesList } from './types';

// Current URL for SCFind as of 2/12/2025
// PROD
export const SCFIND_BASE = 'http://scfind.hubmapconsortium.org/api';
// DEV
// export const SCFIND_BASE = 'http://18.219.167.106:8080/api';

// TODO: Transfer to app config

/**
 * Helper method to form URLs for SCFind API requests
 *
 * @param endpoint - The endpoint to hit
 * @param params - The parameters to include in the URL
 */
export function createScfindKey(endpoint: string, params: Record<string, string | undefined>): string {
  const urlParams = new URLSearchParams();
  // Filter out undefined values from url params
  Object.entries(params)
    .filter(([, value]) => value)
    .forEach(([key, value]) => urlParams.append(key, value!));
  const fullUrl = new URL(`${SCFIND_BASE}/${endpoint}?${urlParams.toString()}`);
  return fullUrl.toString();
}

/**
 * Helper method to format annotation names for SCFind API requests
 * Formats annotation names to [
 *  {"Organ": "organ1", "Tissue": "tissue1"},
 *  {"Organ": "organ1", "Tissue": "tissue2"},
 * ].
 *
 * @param annotationNames  - The annotation names to format
 * @returns The formatted annotation names, or undefined if annotationNames is undefined
 */
export function annotationNamesToGetParams(annotationNames?: AnnotationNamesList): string | undefined {
  if (!annotationNames) {
    return undefined;
  }
  const list = annotationNames.map(({ Organ, Tissue }) => `{"Organ": "${Organ}", "Tissue": "${Tissue}"}`).join(',');
  return `[${list}]`;
}
