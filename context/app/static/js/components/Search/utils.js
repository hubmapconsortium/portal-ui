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
  return {
    type: 'RefinementListFilter',
    props: {
      id: id,
      title: 'Organ',
      field: `${id}.keyword`,
      operator: 'OR',
      size: 5,
      translations: {
        // From search-schema:
        BL: 'Bladder',
        BR: 'Brain',
        LB: 'Bronchus (Left)',
        RB: 'Bronchus (Right)',
        HT: 'Heart',
        LK: 'Kidney (Left)',
        RK: 'Kidney (Right)',
        LI: 'Large Intestine',
        LV: 'Liver',
        LL: 'Lung (Left)',
        RL: 'Lung (Right)',
        LY01: 'Lymph Node 01',
        LY02: 'Lymph Node 02',
        LY03: 'Lymph Node 03',
        LY04: 'Lymph Node 04',
        LY05: 'Lymph Node 05',
        LY06: 'Lymph Node 06',
        LY07: 'Lymph Node 07',
        LY08: 'Lymph Node 08',
        LY09: 'Lymph Node 09',
        LY10: 'Lymph Node 10',
        LY11: 'Lymph Node 11',
        LY12: 'Lymph Node 12',
        LY13: 'Lymph Node 13',
        LY14: 'Lymph Node 14',
        LY15: 'Lymph Node 15',
        LY16: 'Lymph Node 16',
        LY17: 'Lymph Node 17',
        LY18: 'Lymph Node 18',
        LY19: 'Lymph Node 19',
        LY20: 'Lymph Node 20',
        SI: 'Small Intestine',
        SP: 'Spleen',
        TH: 'Thymus',
        TR: 'Trachea',
        UR: 'Ureter',
        OT: 'Other'
      }
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
