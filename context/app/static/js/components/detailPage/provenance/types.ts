export interface ProvData {
  activity: Record<string, Record<string, string>>;
  entity: Record<string, Record<string, string>>;
  prefix: Record<string, Record<string, string>>;
  used: Record<string, Record<string, string>>;
  wasGeneratedBy: Record<string, Record<string, string>>;
  agent: Record<string, Record<string, string>>;
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
