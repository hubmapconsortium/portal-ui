import { ProvData } from '../types';

/**
 * Creates name function for activities based on the provenance data format
 * @param idKey The key to use for the activity ID (e.g., 'hubmap:displayDOI' or 'hubmap:hubmap_id')
 * @returns Function that formats activity names
 */
export function createGetNameForActivity(idKey: string) {
  return (id: string, prov?: ProvData) => {
    if (!prov) return id;
    const activity = prov.activity[id];
    return `${activity['hubmap:creation_action']} - ${activity[idKey]}`;
  };
}

/**
 * Creates name function for entities based on the provenance data format
 * @param typeKey The key to use for the entity type (e.g., 'prov:type' or 'hubmap:entity_type')
 * @param idKey The key to use for the entity ID (e.g., 'hubmap:displayDOI' or 'hubmap:hubmap_id')
 * @returns Function that formats entity names
 */
export function createGetNameForEntity(typeKey: string, idKey: string) {
  return (id: string, prov?: ProvData) => {
    if (!prov) return id;
    const entity = prov.entity[id];
    // NOTE: The initial entity node was not included in the sample data;
    // Fallback to ID, if needed. https://github.com/hubmapconsortium/prov-vis/issues/15
    return entity ? `${entity[typeKey]} - ${entity[idKey]}` : id;
  };
}
