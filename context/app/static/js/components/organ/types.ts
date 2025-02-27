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

export interface OrganDataProducts {
  data_product_id: string;
  creation_time: string;
  tissue: {
    tissuetype: string;
    tissuecode: string;
    uberoncode: string;
  };
  dataSets: {
    uuid: string;
    hubmap_id: string;
    annotation_metadata: {
      is_annotated: boolean;
    };
  }[];
  assay: {
    assayName: string;
  };
  shiny_app: string;
  download: string;
  download_raw: string;
  raw_file_size_bytes: number;
  processed_file_sizes_bytes: number;
  raw_cell_type_counts: Record<string, number>;
  processed_cell_type_counts: Record<string, number>;
}
