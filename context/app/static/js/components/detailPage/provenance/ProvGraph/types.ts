export interface ProvData {
  activity: Record<string, Record<string, string>>;
  entity: Record<string, Record<string, string>>;
  prefix: Record<string, Record<string, string>>;
  used: Record<string, Record<string, string>>;
  wasGeneratedBy: Record<string, Record<string, string>>;
}

export interface ProvNode {
  meta: {
    prov: Record<string, string>;
    name: string;
  };
}
