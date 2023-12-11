export interface BasicGeneInfo {
  approved_name: string;
  approved_symbol: string;
  summary: string;
}

export interface GeneListResponse {
  genes: BasicGeneInfo[];
  pagination: {
    items_per_page: number;
    page: number;
    total_pages: number;
    starts_with: string;
    item_count: number;
  };
}

export interface OrganInfo {
  id: string;
  source: string;
  name: string;
}

export interface CellTypeInfo {
  definition: string;
  id: string;
  name: string;
  organs: OrganInfo[];
  sources: string[];
}

export interface GeneDetail extends BasicGeneInfo {
  alias_names: string[];
  alias_symbols: string[];
  cell_types: CellTypeInfo[];
  previous_symbols: string[];
  previous_names: string[];
  references: {
    id: string;
    source: string;
    url: string;
  }[];
}
