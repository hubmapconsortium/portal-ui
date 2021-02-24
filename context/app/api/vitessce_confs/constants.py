from enum import Enum

class Assays(Enum):
  IMAGE_PYRAMID = "image_pyramid"
  CODEX_CYTOKIT = "codex_cytokit"
  SEQFISH = "seqFish"
  MALDI_IMS_NEG = "MALDI-IMS-neg"
  MALDI_IMS_POS = "MALDI-IMS-pos"

  SCRNA_SEQ_10X = "salmon_rnaseq_10x"
  SCRNA_SEQ_SCI = "salmon_rnaseq_sciseq"
  SCRNA_SEQ_SNARE = "salmon_rnaseq_snareseq"
  SCRNA_SEQ_SN = "salmon_sn_rnaseq_10x"
  SCATAC_SEQ_SCI = "sc_atac_seq_sci"
  SCATAC_SEQ_SNARE = "sc_atac_seq_snare"
  SCATAC_SEQ_SN = "sn_atac_seq"
class AssetPaths(Enum):
  SCRNA_SEQ_DIR = "cluster-marker-genes/output/cluster_marker_genes"
  SCATAC_SEQ_DIR = "output"

  OFFSETS_DIR = "output_offsets"
  IMAGE_PYRAMID_DIR = "ometiff-pyramids"
  CODEX_TILE_DIR = "output/extract/expressions/ome-tiff"
  CODDEX_SPRM_DIR = "output_json"
  TILE_REGEX = r"R\d+_X\d+_Y\d+"
  SEQFISH_HYB_CYCLE_REGEX = r"(HybCycle_\d+|final_mRNA_background)"
  SEQFISH_FILE_REGEX = r"MMStack_Pos\d+\.ome\.tiff?"
