export type DatasetFile = {
  description: string;
  edam_term: string;
  is_qa_qc: boolean;
  is_data_product?: boolean;
  mapped_description: string;
  rel_path: string;
  size: number;
  type: string;
};
