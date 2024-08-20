type Markdown = string;

export interface AzimuthConfig {
  annotations: {
    file: string;
    name: string;
  }[];
  applink: Markdown;
  dataref: Markdown;
  demodata: Markdown;
  image: string;
  modalities: string;
  nunit: string;
  snakemake: string;
  species: string;
  title: string;
  uberon_iri: string;
  unit: string;
  vitessce: string;
  vitessce_conf: object;
  vitessce_conf_url: string;
  zenodo: string;
}

export interface OrganFile {
  asctb: string;
  description: string;
  has_iu_component: boolean;
  icon: string;
  name: string;
  search: string[];
  uberon: string;
  uberon_short: string;
  azimuth?: AzimuthConfig;
}

export interface OrganFileWithDescendants extends OrganFile {
  descendantCounts: Record<string, number>;
}
