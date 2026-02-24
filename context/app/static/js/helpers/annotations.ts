export const objectTypeLabels: Record<string, string> = {
  'CL:0000000': 'Cell',
  'UBERON:0000074': 'Renal Glomerulus',
  'UBERON:0001637': 'Artery',
  'UBERON:0009773': 'Renal Tubule',
};

export function mapObjectType(id: string) {
  return objectTypeLabels[id] ?? id;
}

export const annotationToolLinks: Record<string, string> = {
  FUSION: 'https://doi.org/10.1038/s41467-025-63050-9',
  Azimuth: 'https://www.cell.com/cell/fulltext/S0092-8674(21)00583-3',
  'Pan-human Azimuth': 'https://satijalab.org/pan_human_azimuth/',
};
