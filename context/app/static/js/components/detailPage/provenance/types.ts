export interface ProvEdge {
  'prov:activity': string;
  'prov:entity': string;
}

/**
 * Types for provenance data
 * `activity` and `entity` are nodes in the provenance graph
 * `used` are edges where an activity used an entity as input
 * `wasGeneratedBy` are edges where an activity generated an entity as output
 * @see https://github.com/End-to-end-provenance/ExtendedProvJson/blob/e6586e0aefb9dac18b4ec03d30193ad9c3bacdab/JSON-format.md
 * @see https://www.w3.org/submissions/2013/SUBM-prov-json-20130424/
 */
export interface ProvData {
  activity: Record<string, Record<string, string>>;
  entity: Record<string, Record<string, string>>;
  prefix: Record<string, string>;
  used: Record<string, ProvEdge>;
  wasGeneratedBy: Record<string, ProvEdge>;
  agent: Record<string, Record<string, unknown>>;
  actedOnBehalfOf: Record<string, Record<string, string>>;
}

export interface ProvNode {
  meta: {
    prov: Record<string, string>;
    name: string;
  };
  nodeType: string;
  title: string;
  name: string;
}

export interface Target {
  step: string;
  name: string;
}

export interface CWLInput {
  name: string;
  source: { name: string; for_file: string; step?: string }[];
  run_data: { file: { '@id': string }[] };
  meta: Record<string, unknown>;
  prov: unknown;
}

export interface CWLOutput {
  name: string;
  target: { step: unknown; name: string }[];
  run_data: { file: { '@id': string }[] };
  meta: Record<string, unknown>;
  prov: unknown;
}

export interface Step {
  name: string;
  inputs: CWLInput[];
  outputs: CWLOutput[];
  target?: Target[];
  prov: unknown;
}
