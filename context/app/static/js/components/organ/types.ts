export interface OrganFile {
  asctb: string;
  description: string;
  has_iu_component: boolean;
  icon: string;
  name: string;
  search: string[];
  uberon: string;
  uberon_short: string;
}

export interface OrganFileWithDescendants extends OrganFile {
  descendantCounts: Record<string, number>;
}
