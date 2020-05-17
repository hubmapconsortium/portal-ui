import fromEntries from 'fromentries';
import searchDefinitions from '../../../../../search-schema/data/definitions.yaml';

export function field(id, name) {
  return {
    id: id,
    name: name,
  };
}

export function filter(id, name) {
  return {
    type: 'RefinementListFilter',
    props: {
      id: id,
      title: name,
      field: `${id}.keyword`,
      operator: 'OR',
      size: 5,
    },
  };
}

export function organFilter(id) {
  const organTranslations = fromEntries(
    Object.entries(
      searchDefinitions.enums.organ_types
    ).map((entry) => [entry[0], entry[1].description])
  )

  return {
    type: 'RefinementListFilter',
    props: {
      id: id,
      title: 'Organ',
      field: `${id}.keyword`,
      operator: 'OR',
      size: 5,
      translations: organTranslations,
    }
  };
}

export function specimenTypeFilter(id){
  return {
    type: 'RefinementListFilter',
    props: {
      id: id,
      title: 'Specimen Type',
      field: `${id}.keyword`,
      operator: 'OR',
      size: 5,
      translations: {
        // From search-schema:
        atacseq: 'ATACseq',
        biopsy: 'Biopsy',
        blood: 'Blood',
        cell_lysate: 'Cell lysate',
        clarity_hydrogel: 'CLARITY hydrogel',
        codex: 'CODEX',
        cryosections_curls_from_fresh_frozen_oct: 'Cryosections/curls from fresh frozen OCT',
        cryosections_curls_rnalater: 'Cryosectinos/curls RNAlater',
        ffpe_block: 'FFPE block',
        ffpe_slide: 'FFPE slide',
        fixed_frozen_section_slide: 'Fixed Frozen section slide',
        fixed_tissue_piece: 'Fixed tissue piece',
        flash_frozen_liquid_nitrogen: 'Flash frozen, liquid nitrogen',
        formalin_fixed_oct_block: 'Formalin fixed OCT block',
        fresh_frozen_oct_block: 'Fresh frozen oct block',
        fresh_frozen_section_slide: 'Fresh Frozen section slide',
        fresh_frozen_tissue: 'Fresh frozen tissue',
        fresh_frozen_tissue_section: 'Fresh Frozen Tissue Section',
        fresh_tissue: 'Fresh tissue',
        frozen_cell_pellet_buffy_coat: 'Frozen cell pellet (Buffy coat)',
        gdna: 'gDNA',
        module: 'Module',
        nuclei: 'Nuclei',
        nuclei_rnalater: 'Nuclei RNAlater',
        organ: 'Organ',
        organ_piece: 'Organ Piece',
        other: 'Other',
        pbmc: 'PBMC',
        pfa_fixed_frozen_oct_block: 'PFA Fixed frozen OCT block',
        plasma: 'Plasma',
        protein: 'Protein',
        ran_poly_a_enriched: 'RNA, poly-A enriched',
        rna_total: 'RNA, total',
        rnalater_treated_and_stored: 'RNAlater treated and stored',
        rnaseq: 'RNAseq',
        scatacseq: 'scATACseq',
        scrnaseq: 'scRNAseq',
        segment: 'Segment',
        seqfish: 'seqFISH',
        serum: 'Serum',
        single_cell_cryopreserved: 'Single cell cryopreserved',
        snatacseq: 'snATACseq',
        snrnaseq: 'snRNAseq',
        tissue_lysate: 'Tissue lysate',
        wgs: 'Whole Genome Sequencing'
      }
    }
  };
}
