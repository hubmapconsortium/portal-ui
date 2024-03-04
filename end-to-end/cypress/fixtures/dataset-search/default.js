const response = {
  _shards: {
    failed: 0,
    skipped: 0,
    successful: 5,
    total: 5,
  },
  aggregations: {
    analyte_class6: {
      "analyte_class.keyword": {
        buckets: [
          {
            doc_count: 728,
            key: "RNA",
          },
          {
            doc_count: 530,
            key: "protein",
          },
          {
            doc_count: 416,
            key: "DNA",
          },
          {
            doc_count: 156,
            key: "metabolites",
          },
          {
            doc_count: 155,
            key: "lipids",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 76,
      },
      "analyte_class.keyword_count": {
        value: 8,
      },
      doc_count: 2080,
    },
    ancestor_ids21: {
      "ancestor_ids.keyword": {
        buckets: [
          {
            doc_count: 161,
            key: "1628b6f7eb615862322d6274a6bc9fa0",
          },
          {
            doc_count: 125,
            key: "0e1c2d399477b244ac006eb58918ec0c",
          },
          {
            doc_count: 125,
            key: "4397fcd072ac96299992b47da1dbae64",
          },
          {
            doc_count: 110,
            key: "909b44eb01033314b357a3692b583387",
          },
          {
            doc_count: 110,
            key: "d3ad6409d2ad37ef7dbcc90ccc199f68",
          },
        ],
        doc_count_error_upper_bound: 57,
        sum_other_doc_count: 9230,
      },
      "ancestor_ids.keyword_count": {
        value: 2787,
      },
      doc_count: 2080,
    },
    assay_modality13: {
      "assay_modality.keyword": {
        buckets: [
          {
            doc_count: 2080,
            key: "single",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "assay_modality.keyword_count": {
        value: 1,
      },
      doc_count: 2080,
    },
    created_by_user_displayname20: {
      "created_by_user_displayname.keyword": {
        buckets: [
          {
            doc_count: 945,
            key: "HuBMAP Process",
          },
          {
            doc_count: 376,
            key: "Joel Welling",
          },
          {
            doc_count: 178,
            key: "Daniel Cotter",
          },
          {
            doc_count: 132,
            key: "Juan Puerto",
          },
          {
            doc_count: 101,
            key: "Blue Lake",
          },
        ],
        doc_count_error_upper_bound: 6,
        sum_other_doc_count: 348,
      },
      "created_by_user_displayname.keyword_count": {
        value: 21,
      },
      doc_count: 2080,
    },
    descendant_ids23: {
      "descendant_ids.keyword": {
        buckets: [
          {
            doc_count: 20,
            key: "6501730e10d3b95b8db217c245b4ddfa",
          },
          {
            doc_count: 20,
            key: "aea510e37bc0f1287735f963cff7f671",
          },
          {
            doc_count: 20,
            key: "ed8a7f64ee8663889867b71ab3ec7cf0",
          },
          {
            doc_count: 20,
            key: "f31589d0b14d86ac99e4d8ca4c2932f2",
          },
          {
            doc_count: 14,
            key: "9a4dc39b6545cab0326a2af83e16bd9c",
          },
        ],
        doc_count_error_upper_bound: 15,
        sum_other_doc_count: 2496,
      },
      "descendant_ids.keyword_count": {
        value: 1721,
      },
      doc_count: 2080,
    },
    "donor.mapped_metadata.age_value15": {
      doc_count: 2072,
      "donor.mapped_metadata.age_value": {
        buckets: [
          {
            doc_count: 32,
            key: 0,
          },
          {
            doc_count: 2,
            key: 5,
          },
          {
            doc_count: 43,
            key: 10,
          },
          {
            doc_count: 87,
            key: 15,
          },
          {
            doc_count: 269,
            key: 20,
          },
          {
            doc_count: 167,
            key: 25,
          },
          {
            doc_count: 98,
            key: 30,
          },
          {
            doc_count: 372,
            key: 35,
          },
          {
            doc_count: 65,
            key: 40,
          },
          {
            doc_count: 74,
            key: 45,
          },
          {
            doc_count: 131,
            key: 50,
          },
          {
            doc_count: 197,
            key: 55,
          },
          {
            doc_count: 72,
            key: 60,
          },
          {
            doc_count: 282,
            key: 65,
          },
          {
            doc_count: 5,
            key: 70,
          },
          {
            doc_count: 176,
            key: 75,
          },
          {
            doc_count: 0,
            key: 80,
          },
          {
            doc_count: 0,
            key: 85,
          },
          {
            doc_count: 0,
            key: 90,
          },
          {
            doc_count: 0,
            key: 95,
          },
          {
            doc_count: 0,
            key: 100,
          },
        ],
      },
    },
    "donor.mapped_metadata.body_mass_index_value17": {
      doc_count: 1890,
      "donor.mapped_metadata.body_mass_index_value": {
        buckets: [
          {
            doc_count: 0,
            key: 0,
          },
          {
            doc_count: 0,
            key: 3,
          },
          {
            doc_count: 0,
            key: 6,
          },
          {
            doc_count: 0,
            key: 9,
          },
          {
            doc_count: 0,
            key: 12,
          },
          {
            doc_count: 6,
            key: 15,
          },
          {
            doc_count: 247,
            key: 18,
          },
          {
            doc_count: 329,
            key: 21,
          },
          {
            doc_count: 147,
            key: 24,
          },
          {
            doc_count: 470,
            key: 27,
          },
          {
            doc_count: 375,
            key: 30,
          },
          {
            doc_count: 200,
            key: 33,
          },
          {
            doc_count: 63,
            key: 36,
          },
          {
            doc_count: 16,
            key: 39,
          },
          {
            doc_count: 13,
            key: 42,
          },
          {
            doc_count: 16,
            key: 45,
          },
          {
            doc_count: 8,
            key: 48,
          },
        ],
      },
    },
    "donor.mapped_metadata.race16": {
      doc_count: 2080,
      "donor.mapped_metadata.race.keyword": {
        buckets: [
          {
            doc_count: 1395,
            key: "White",
          },
          {
            doc_count: 546,
            key: "Black or African American",
          },
          {
            doc_count: 93,
            key: "Unknown",
          },
          {
            doc_count: 31,
            key: "Asian",
          },
          {
            doc_count: 18,
            key: "Hispanic",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 7,
      },
      "donor.mapped_metadata.race.keyword_count": {
        value: 7,
      },
    },
    "donor.mapped_metadata.sex14": {
      doc_count: 2080,
      "donor.mapped_metadata.sex.keyword": {
        buckets: [
          {
            doc_count: 1113,
            key: "Male",
          },
          {
            doc_count: 951,
            key: "Female",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "donor.mapped_metadata.sex.keyword_count": {
        value: 2,
      },
    },
    entity_type22: {
      doc_count: 4323,
      "entity_type.keyword": {
        buckets: [
          {
            doc_count: 2080,
            key: "Dataset",
          },
          {
            doc_count: 1790,
            key: "Sample",
          },
          {
            doc_count: 216,
            key: "Support",
          },
          {
            doc_count: 211,
            key: "Donor",
          },
          {
            doc_count: 18,
            key: "Collection",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 8,
      },
      "entity_type.keyword_count": {
        value: 6,
      },
    },
    group_name19: {
      doc_count: 2080,
      "group_name.keyword": {
        buckets: [
          {
            doc_count: 703,
            key: "Stanford TMC",
          },
          {
            doc_count: 546,
            key: "University of California San Diego TMC",
          },
          {
            doc_count: 211,
            key: "Stanford RTI",
          },
          {
            doc_count: 201,
            key: "Vanderbilt TMC",
          },
          {
            doc_count: 192,
            key: "University of Florida TMC",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 227,
      },
      "group_name.keyword_count": {
        value: 13,
      },
    },
    mapped_consortium18: {
      doc_count: 2080,
      "mapped_consortium.keyword": {
        buckets: [
          {
            doc_count: 2070,
            key: "HuBMAP",
          },
          {
            doc_count: 10,
            key: "Human Cell Atlas",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "mapped_consortium.keyword_count": {
        value: 2,
      },
    },
    "mapped_status-mapped_data_access_level": {
      doc_count: 2080,
      "mapped_status.keyword": {
        buckets: [
          {
            doc_count: 2080,
            key: "Published",
            "mapped_data_access_level.keyword": {
              buckets: [
                {
                  doc_count: 1370,
                  key: "Public",
                },
                {
                  doc_count: 710,
                  key: "Protected",
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
    },
    "origin_samples.mapped_organ5": {
      doc_count: 2080,
      "origin_samples.mapped_organ.keyword": {
        buckets: [
          {
            doc_count: 369,
            key: "Kidney (Left)",
          },
          {
            doc_count: 358,
            key: "Large Intestine",
          },
          {
            doc_count: 353,
            key: "Small Intestine",
          },
          {
            doc_count: 325,
            key: "Kidney (Right)",
          },
          {
            doc_count: 211,
            key: "Uterus",
          },
        ],
        doc_count_error_upper_bound: 1,
        sum_other_doc_count: 468,
      },
      "origin_samples.mapped_organ.keyword_count": {
        value: 18,
      },
    },
    pipeline10: {
      doc_count: 2080,
      "pipeline.keyword": {
        buckets: [
          {
            doc_count: 298,
            key: "Salmon",
          },
          {
            doc_count: 126,
            key: "Cytokit + SPRM",
          },
          {
            doc_count: 106,
            key: "SnapATAC",
          },
          {
            doc_count: 13,
            key: "Lab Processed",
          },
          {
            doc_count: 8,
            key: "BWA + MACS2",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "pipeline.keyword_count": {
        value: 5,
      },
    },
    processing9: {
      doc_count: 2080,
      "processing.keyword": {
        buckets: [
          {
            doc_count: 1529,
            key: "raw",
          },
          {
            doc_count: 551,
            key: "processed",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "processing.keyword_count": {
        value: 2,
      },
    },
    processing_type12: {
      doc_count: 2080,
      "processing_type.keyword": {
        buckets: [
          {
            doc_count: 538,
            key: "hubmap",
          },
          {
            doc_count: 13,
            key: "lab",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "processing_type.keyword_count": {
        value: 2,
      },
    },
    "raw_dataset_type-assay_display_name": {
      doc_count: 2080,
      "raw_dataset_type.keyword": {
        buckets: [
          {
            "assay_display_name.keyword": {
              buckets: [
                {
                  doc_count: 173,
                  key: "snRNA-seq [Salmon]",
                },
                {
                  doc_count: 157,
                  key: "snRNAseq (SNARE-seq2)",
                },
                {
                  doc_count: 155,
                  key: "snRNA-seq (10x Genomics v3)",
                },
                {
                  doc_count: 36,
                  key: "scRNA-seq (10x Genomics) [Salmon]",
                },
                {
                  doc_count: 32,
                  key: "scRNA-seq (10x Genomics v3)",
                },
                {
                  doc_count: 27,
                  key: "snRNA-seq (SNARE-seq2) [Salmon]",
                },
                {
                  doc_count: 12,
                  key: "sciRNA-seq [Salmon]",
                },
                {
                  doc_count: 11,
                  key: "sciRNA-seq",
                },
                {
                  doc_count: 8,
                  key: "Bulk RNA-seq",
                },
                {
                  doc_count: 8,
                  key: "Bulk RNA-seq [Salmon]",
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 5,
            },
            doc_count: 624,
            key: "RNAseq",
          },
          {
            "assay_display_name.keyword": {
              buckets: [
                {
                  doc_count: 176,
                  key: "snATACseq (SNARE-seq2)",
                },
                {
                  doc_count: 68,
                  key: "snATAC-seq",
                },
                {
                  doc_count: 67,
                  key: "snATAC-seq [SnapATAC]",
                },
                {
                  doc_count: 21,
                  key: "sciATAC-seq",
                },
                {
                  doc_count: 21,
                  key: "sciATAC-seq [SnapATAC]",
                },
                {
                  doc_count: 18,
                  key: "snATAC-seq (SNARE-seq2) [SnapATAC]",
                },
                {
                  doc_count: 16,
                  key: "Bulk ATAC-seq",
                },
                {
                  doc_count: 8,
                  key: "Bulk ATAC-seq [BWA + MACS2]",
                },
                {
                  doc_count: 4,
                  key: "snATAC-seq (SNARE-seq2) [Lab Processed]",
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
            doc_count: 399,
            key: "ATACseq",
          },
          {
            "assay_display_name.keyword": {
              buckets: [
                {
                  doc_count: 202,
                  key: "LC-MS",
                },
                {
                  doc_count: 18,
                  key: "LC-MS Bottom Up",
                },
                {
                  doc_count: 18,
                  key: "Label-free LC-MS/MS",
                },
                {
                  doc_count: 11,
                  key: "LC-MS Top Down",
                },
                {
                  doc_count: 8,
                  key: "MS",
                },
                {
                  doc_count: 2,
                  key: "TMT LC-MS",
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
            doc_count: 259,
            key: "LC-MS",
          },
          {
            "assay_display_name.keyword": {
              buckets: [
                {
                  doc_count: 127,
                  key: "CODEX",
                },
                {
                  doc_count: 126,
                  key: "CODEX [Cytokit + SPRM]",
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
            doc_count: 253,
            key: "CODEX",
          },
          {
            "assay_display_name.keyword": {
              buckets: [
                {
                  doc_count: 211,
                  key: "Multiplex Ion Beam Imaging",
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
            doc_count: 211,
            key: "MIBI",
          },
          {
            "assay_display_name.keyword": {
              buckets: [
                {
                  doc_count: 89,
                  key: "MALDI IMS",
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
            doc_count: 89,
            key: "MALDI",
          },
          {
            "assay_display_name.keyword": {
              buckets: [
                {
                  doc_count: 42,
                  key: "Slide-seq",
                },
                {
                  doc_count: 42,
                  key: "Slide-seq [Salmon]",
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
            doc_count: 84,
            key: "Slide-seq",
          },
          {
            "assay_display_name.keyword": {
              buckets: [
                {
                  doc_count: 46,
                  key: "PAS Stained Microscopy",
                },
                {
                  doc_count: 1,
                  key: "sciRNA-seq",
                },
                {
                  doc_count: 1,
                  key: "snRNAseq (SNARE-seq2)",
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
            doc_count: 48,
            key: "Histology",
          },
          {
            "assay_display_name.keyword": {
              buckets: [
                {
                  doc_count: 34,
                  key: "Autofluorescence Microscopy",
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
            doc_count: 34,
            key: "Auto-fluorescence",
          },
          {
            "assay_display_name.keyword": {
              buckets: [
                {
                  doc_count: 9,
                  key: "seqFISH",
                },
                {
                  doc_count: 9,
                  key: "seqFISH [Lab Processed]",
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
            doc_count: 18,
            key: "seqFish",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 61,
      },
    },
    "source_samples.sample_category7": {
      doc_count: 2080,
      "source_samples.sample_category.keyword": {
        buckets: [
          {
            doc_count: 1166,
            key: "section",
          },
          {
            doc_count: 848,
            key: "block",
          },
          {
            doc_count: 62,
            key: "suspension",
          },
          {
            doc_count: 4,
            key: "organ",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "source_samples.sample_category.keyword_count": {
        value: 4,
      },
    },
    visualization11: {
      doc_count: 2080,
      visualization: {
        buckets: [
          {
            doc_count: 1558,
            key: 0,
            key_as_string: "false",
          },
          {
            doc_count: 522,
            key: 1,
            key_as_string: "true",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      visualization_count: {
        value: 2,
      },
    },
  },
  hits: {
    hits: [
      {
        _id: "3f678ab5cd7ed086ec0d2d4468fc5094",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "University of Florida TMC",
          hubmap_id: "HBM279.SLFX.335",
          last_modified_timestamp: 1708055454242,
          mapped_data_types: ["scRNA-seq (10x Genomics) [Salmon]"],
          mapped_last_modified_timestamp: "2024-02-16 03:50:54",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Spleen",
            },
          ],
          uuid: "3f678ab5cd7ed086ec0d2d4468fc5094",
        },
        _type: "_doc",
        sort: ["2024-02-16 03:50:54"],
      },
      {
        _id: "7531c7b642469f7fdf1e2e8af4048b00",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM474.DNHJ.729",
          last_modified_timestamp: 1707941237525,
          mapped_data_types: ["Autofluorescence Microscopy"],
          mapped_last_modified_timestamp: "2024-02-14 20:07:17",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "7531c7b642469f7fdf1e2e8af4048b00",
        },
        _type: "_doc",
        sort: ["2024-02-14 20:07:17"],
      },
      {
        _id: "a44a78bfbe0e702cdc172707b6061a16",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 2,
            },
          },
          group_name: "California Institute of Technology TMC",
          hubmap_id: "HBM645.XLLN.924",
          last_modified_timestamp: 1706810767064,
          mapped_data_types: ["sciRNA-seq"],
          mapped_last_modified_timestamp: "2024-02-01 18:06:07",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Ovary (Right)",
            },
          ],
          uuid: "a44a78bfbe0e702cdc172707b6061a16",
        },
        _type: "_doc",
        sort: ["2024-02-01 18:06:07"],
      },
      {
        _id: "421007293469db7b528ce6478c00348d",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 2,
            },
          },
          group_name: "University of California San Diego TMC",
          hubmap_id: "HBM575.XFCT.276",
          last_modified_timestamp: 1706646947735,
          mapped_data_types: ["snRNAseq (SNARE-seq2)"],
          mapped_last_modified_timestamp: "2024-01-30 20:35:47",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Ovary (Right)",
            },
          ],
          uuid: "421007293469db7b528ce6478c00348d",
        },
        _type: "_doc",
        sort: ["2024-01-30 20:35:47"],
      },
      {
        _id: "69c70762689b20308bb049ac49653342",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "Stanford TMC",
          hubmap_id: "HBM926.SHNZ.594",
          last_modified_timestamp: 1700186651835,
          mapped_data_types: ["CODEX [Cytokit + SPRM]"],
          mapped_last_modified_timestamp: "2023-11-17 02:04:11",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Small Intestine",
            },
          ],
          uuid: "69c70762689b20308bb049ac49653342",
        },
        _type: "_doc",
        sort: ["2023-11-17 02:04:11"],
      },
      {
        _id: "804df200e0003180cc5a62493ea5dced",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Stanford TMC",
          hubmap_id: "HBM734.XBSR.357",
          last_modified_timestamp: 1700186648001,
          mapped_data_types: ["CODEX"],
          mapped_last_modified_timestamp: "2023-11-17 02:04:08",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Small Intestine",
            },
          ],
          uuid: "804df200e0003180cc5a62493ea5dced",
        },
        _type: "_doc",
        sort: ["2023-11-17 02:04:08"],
      },
      {
        _id: "dd648e4648238b25a7d1062669ea89af",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "University of California San Diego TMC",
          hubmap_id: "HBM948.GXMD.986",
          last_modified_timestamp: 1699331768836,
          mapped_data_types: ["snRNA-seq (SNARE-seq2) [Salmon]"],
          mapped_last_modified_timestamp: "2023-11-07 04:36:08",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Lung (Right)",
            },
          ],
          uuid: "dd648e4648238b25a7d1062669ea89af",
        },
        _type: "_doc",
        sort: ["2023-11-07 04:36:08"],
      },
      {
        _id: "10c0c11280c00f324259fe38e2291ee4",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "Stanford TMC",
          hubmap_id: "HBM953.LMWQ.235",
          last_modified_timestamp: 1699331648258,
          mapped_data_types: ["CODEX [Cytokit + SPRM]"],
          mapped_last_modified_timestamp: "2023-11-07 04:34:08",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Large Intestine",
            },
          ],
          uuid: "10c0c11280c00f324259fe38e2291ee4",
        },
        _type: "_doc",
        sort: ["2023-11-07 04:34:08"],
      },
      {
        _id: "176edb4b0e16059522f6f087576fbeec",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "University of California San Diego TMC",
          hubmap_id: "HBM975.WQQQ.853",
          last_modified_timestamp: 1699331527267,
          mapped_data_types: ["snRNA-seq (SNARE-seq2) [Salmon]"],
          mapped_last_modified_timestamp: "2023-11-07 04:32:07",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Lung (Right)",
            },
          ],
          uuid: "176edb4b0e16059522f6f087576fbeec",
        },
        _type: "_doc",
        sort: ["2023-11-07 04:32:07"],
      },
      {
        _id: "a39fed027b51d97f83cec90c63c44744",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "University of California San Diego TMC",
          hubmap_id: "HBM456.GRCM.369",
          last_modified_timestamp: 1699331406731,
          mapped_data_types: ["snRNA-seq (SNARE-seq2) [Salmon]"],
          mapped_last_modified_timestamp: "2023-11-07 04:30:06",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Lung (Right)",
            },
          ],
          uuid: "a39fed027b51d97f83cec90c63c44744",
        },
        _type: "_doc",
        sort: ["2023-11-07 04:30:06"],
      },
      {
        _id: "7b2b9029035d46c4ef8306fa82c8e58e",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "Stanford TMC",
          hubmap_id: "HBM776.FNRJ.959",
          last_modified_timestamp: 1699331285710,
          mapped_data_types: ["CODEX [Cytokit + SPRM]"],
          mapped_last_modified_timestamp: "2023-11-07 04:28:05",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Large Intestine",
            },
          ],
          uuid: "7b2b9029035d46c4ef8306fa82c8e58e",
        },
        _type: "_doc",
        sort: ["2023-11-07 04:28:05"],
      },
      {
        _id: "4158174807d97dccbd75d0b162edd9a3",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "Stanford TMC",
          hubmap_id: "HBM959.BVWN.344",
          last_modified_timestamp: 1699331043313,
          mapped_data_types: ["CODEX [Cytokit + SPRM]"],
          mapped_last_modified_timestamp: "2023-11-07 04:24:03",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Small Intestine",
            },
          ],
          uuid: "4158174807d97dccbd75d0b162edd9a3",
        },
        _type: "_doc",
        sort: ["2023-11-07 04:24:03"],
      },
      {
        _id: "d84aa7406bee079fa892d2715b04cd12",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "Stanford TMC",
          hubmap_id: "HBM573.VSCW.874",
          last_modified_timestamp: 1699330680544,
          mapped_data_types: ["snATAC-seq [SnapATAC]"],
          mapped_last_modified_timestamp: "2023-11-07 04:18:00",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Large Intestine",
            },
          ],
          uuid: "d84aa7406bee079fa892d2715b04cd12",
        },
        _type: "_doc",
        sort: ["2023-11-07 04:18:00"],
      },
      {
        _id: "8d86e6c899e80d0f5f95604eb4ad492e",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "Stanford TMC",
          hubmap_id: "HBM634.MSKL.575",
          last_modified_timestamp: 1699330559530,
          mapped_data_types: ["CODEX [Cytokit + SPRM]"],
          mapped_last_modified_timestamp: "2023-11-07 04:15:59",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Large Intestine",
            },
          ],
          uuid: "8d86e6c899e80d0f5f95604eb4ad492e",
        },
        _type: "_doc",
        sort: ["2023-11-07 04:15:59"],
      },
      {
        _id: "0804a7a9e430e6adfbc56f339d787211",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "University of California San Diego TMC",
          hubmap_id: "HBM688.RPFC.258",
          last_modified_timestamp: 1699327654960,
          mapped_data_types: ["snRNA-seq (SNARE-seq2) [Salmon]"],
          mapped_last_modified_timestamp: "2023-11-07 03:27:34",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Right)",
            },
          ],
          uuid: "0804a7a9e430e6adfbc56f339d787211",
        },
        _type: "_doc",
        sort: ["2023-11-07 03:27:34"],
      },
      {
        _id: "c14b104f9e44511ddf82697bce0d1901",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "University of California San Diego TMC",
          hubmap_id: "HBM734.LFLC.264",
          last_modified_timestamp: 1699327534426,
          mapped_data_types: ["snRNA-seq (SNARE-seq2) [Salmon]"],
          mapped_last_modified_timestamp: "2023-11-07 03:25:34",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Right)",
            },
          ],
          uuid: "c14b104f9e44511ddf82697bce0d1901",
        },
        _type: "_doc",
        sort: ["2023-11-07 03:25:34"],
      },
      {
        _id: "615462a0e4aa133d8b19644c404e3eeb",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "University of California San Diego TMC",
          hubmap_id: "HBM334.DWWF.436",
          last_modified_timestamp: 1699327413576,
          mapped_data_types: ["snRNA-seq (SNARE-seq2) [Salmon]"],
          mapped_last_modified_timestamp: "2023-11-07 03:23:33",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Right)",
            },
            {
              mapped_organ: "Ovary (Right)",
            },
          ],
          uuid: "615462a0e4aa133d8b19644c404e3eeb",
        },
        _type: "_doc",
        sort: ["2023-11-07 03:23:33"],
      },
      {
        _id: "e8c159fdeabc3c0bf12345b9b1ec99c9",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          group_name: "Stanford TMC",
          hubmap_id: "HBM494.VNTQ.422",
          last_modified_timestamp: 1699327050685,
          mapped_data_types: ["CODEX [Cytokit + SPRM]"],
          mapped_last_modified_timestamp: "2023-11-07 03:17:30",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Large Intestine",
            },
          ],
          uuid: "e8c159fdeabc3c0bf12345b9b1ec99c9",
        },
        _type: "_doc",
        sort: ["2023-11-07 03:17:30"],
      },
    ],
    max_score: null,
    total: {
      relation: "eq",
      value: 2080,
    },
  },
  timed_out: false,
  took: 46,
};

export default response;
