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
  datasetUUIDs?: string[];
}

export enum OrganPageIds {
  summaryId = 'summary',
  hraId = 'human-reference-atlas',
  assaysId = 'assays',
  integratedMapsId = 'integrated-maps',
  samplesId = 'samples',
  scellopId = 'cell-population-plot',
  cellTypesId = 'cell-types',
}
