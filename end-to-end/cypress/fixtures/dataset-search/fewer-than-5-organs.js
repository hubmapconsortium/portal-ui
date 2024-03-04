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
            doc_count: 88,
            key: "lipids",
          },
          {
            doc_count: 1,
            key: "protein",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "analyte_class.keyword_count": {
        value: 2,
      },
      doc_count: 89,
    },
    ancestor_ids21: {
      "ancestor_ids.keyword": {
        buckets: [
          {
            doc_count: 5,
            key: "3c3c49c7d38960fc1f8275dcf4e412f9",
          },
          {
            doc_count: 4,
            key: "0f1c5d398e6c05fe85d617989216970f",
          },
          {
            doc_count: 4,
            key: "8e90c3bfa86c1a363dbcfe39d18f38b6",
          },
          {
            doc_count: 4,
            key: "96a667104f92a38f5d4f97c38d94e738",
          },
          {
            doc_count: 4,
            key: "aa97d20b4a8f3c1198826091bc5455d9",
          },
        ],
        doc_count_error_upper_bound: 7,
        sum_other_doc_count: 334,
      },
      "ancestor_ids.keyword_count": {
        value: 160,
      },
      doc_count: 89,
    },
    assay_modality13: {
      "assay_modality.keyword": {
        buckets: [
          {
            doc_count: 89,
            key: "single",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "assay_modality.keyword_count": {
        value: 1,
      },
      doc_count: 89,
    },
    created_by_user_displayname20: {
      "created_by_user_displayname.keyword": {
        buckets: [
          {
            doc_count: 63,
            key: "HuBMAP Process",
          },
          {
            doc_count: 26,
            key: "Jeff Spraggins",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "created_by_user_displayname.keyword_count": {
        value: 2,
      },
      doc_count: 89,
    },
    descendant_ids23: {
      "descendant_ids.keyword": {
        buckets: [
          {
            doc_count: 1,
            key: "00a7a9e47679522ca3d9c5526d0b00f5",
          },
          {
            doc_count: 1,
            key: "0358be865f6a315183b56b1d4baf8958",
          },
          {
            doc_count: 1,
            key: "05572abdbe128ad075f879a4d0f6aa1f",
          },
          {
            doc_count: 1,
            key: "097c38b80001579be52be92c2930e7ba",
          },
          {
            doc_count: 1,
            key: "0aec1326f47254fd3bdddfd74bfd17f8",
          },
        ],
        doc_count_error_upper_bound: 4,
        sum_other_doc_count: 137,
      },
      "descendant_ids.keyword_count": {
        value: 142,
      },
      doc_count: 89,
    },
    "donor.mapped_metadata.age_value15": {
      doc_count: 87,
      "donor.mapped_metadata.age_value": {
        buckets: [
          {
            doc_count: 0,
            key: 0,
          },
          {
            doc_count: 0,
            key: 5,
          },
          {
            doc_count: 0,
            key: 10,
          },
          {
            doc_count: 0,
            key: 15,
          },
          {
            doc_count: 2,
            key: 20,
          },
          {
            doc_count: 0,
            key: 25,
          },
          {
            doc_count: 2,
            key: 30,
          },
          {
            doc_count: 0,
            key: 35,
          },
          {
            doc_count: 8,
            key: 40,
          },
          {
            doc_count: 6,
            key: 45,
          },
          {
            doc_count: 6,
            key: 50,
          },
          {
            doc_count: 25,
            key: 55,
          },
          {
            doc_count: 10,
            key: 60,
          },
          {
            doc_count: 14,
            key: 65,
          },
          {
            doc_count: 4,
            key: 70,
          },
          {
            doc_count: 10,
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
      doc_count: 81,
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
            doc_count: 0,
            key: 15,
          },
          {
            doc_count: 0,
            key: 18,
          },
          {
            doc_count: 16,
            key: 21,
          },
          {
            doc_count: 12,
            key: 24,
          },
          {
            doc_count: 14,
            key: 27,
          },
          {
            doc_count: 15,
            key: 30,
          },
          {
            doc_count: 10,
            key: 33,
          },
          {
            doc_count: 4,
            key: 36,
          },
          {
            doc_count: 6,
            key: 39,
          },
          {
            doc_count: 2,
            key: 42,
          },
          {
            doc_count: 2,
            key: 45,
          },
          {
            doc_count: 0,
            key: 48,
          },
        ],
      },
    },
    "donor.mapped_metadata.race16": {
      doc_count: 89,
      "donor.mapped_metadata.race.keyword": {
        buckets: [
          {
            doc_count: 83,
            key: "White",
          },
          {
            doc_count: 4,
            key: "Black or African American",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "donor.mapped_metadata.race.keyword_count": {
        value: 2,
      },
    },
    "donor.mapped_metadata.sex14": {
      doc_count: 89,
      "donor.mapped_metadata.sex.keyword": {
        buckets: [
          {
            doc_count: 44,
            key: "Female",
          },
          {
            doc_count: 43,
            key: "Male",
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
      doc_count: 89,
      "entity_type.keyword": {
        buckets: [
          {
            doc_count: 89,
            key: "Dataset",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "entity_type.keyword_count": {
        value: 1,
      },
    },
    group_name19: {
      doc_count: 89,
      "group_name.keyword": {
        buckets: [
          {
            doc_count: 88,
            key: "Vanderbilt TMC",
          },
          {
            doc_count: 1,
            key: "TTD - Pacific Northwest National Laboratory",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "group_name.keyword_count": {
        value: 2,
      },
    },
    mapped_consortium18: {
      doc_count: 89,
      "mapped_consortium.keyword": {
        buckets: [
          {
            doc_count: 89,
            key: "HuBMAP",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "mapped_consortium.keyword_count": {
        value: 1,
      },
    },
    "mapped_status-mapped_data_access_level": {
      doc_count: 89,
      "mapped_status.keyword": {
        buckets: [
          {
            doc_count: 89,
            key: "Published",
            "mapped_data_access_level.keyword": {
              buckets: [
                {
                  doc_count: 89,
                  key: "Public",
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
      doc_count: 89,
      "origin_samples.mapped_organ.keyword": {
        buckets: [
          {
            doc_count: 55,
            key: "Kidney (Left)",
          },
          {
            doc_count: 34,
            key: "Kidney (Right)",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "origin_samples.mapped_organ.keyword_count": {
        value: 2,
      },
    },
    pipeline10: {
      doc_count: 89,
      "pipeline.keyword": {
        buckets: [],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "pipeline.keyword_count": {
        value: 0,
      },
    },
    processing9: {
      doc_count: 89,
      "processing.keyword": {
        buckets: [
          {
            doc_count: 89,
            key: "raw",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "processing.keyword_count": {
        value: 1,
      },
    },
    processing_type12: {
      doc_count: 89,
      "processing_type.keyword": {
        buckets: [],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "processing_type.keyword_count": {
        value: 0,
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
      doc_count: 89,
      "source_samples.sample_category.keyword": {
        buckets: [
          {
            doc_count: 88,
            key: "section",
          },
          {
            doc_count: 1,
            key: "block",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "source_samples.sample_category.keyword_count": {
        value: 2,
      },
    },
    visualization11: {
      doc_count: 89,
      visualization: {
        buckets: [
          {
            doc_count: 89,
            key: 0,
            key_as_string: "false",
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      visualization_count: {
        value: 1,
      },
    },
  },
  hits: {
    hits: [
      {
        _id: "3bc3ad124014a632d558255626bf38c9",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM799.DZFZ.778",
          last_modified_timestamp: 1692633305360,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:55:05",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Right)",
            },
          ],
          uuid: "3bc3ad124014a632d558255626bf38c9",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:55:05"],
      },
      {
        _id: "b062b82bc2b5af072db4a3af191ec019",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM644.HLRW.739",
          last_modified_timestamp: 1692633302380,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:55:02",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Right)",
            },
          ],
          uuid: "b062b82bc2b5af072db4a3af191ec019",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:55:02"],
      },
      {
        _id: "18088e0f3778230bd23812725ada7091",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM349.DTWT.383",
          last_modified_timestamp: 1692633299044,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:59",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "18088e0f3778230bd23812725ada7091",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:59"],
      },
      {
        _id: "c8ad223f01b45b25e0dcb07c48a42762",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM472.NWBK.884",
          last_modified_timestamp: 1692633295873,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:55",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "c8ad223f01b45b25e0dcb07c48a42762",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:55"],
      },
      {
        _id: "12ef2bc519d442d4685ee956ccd18ccc",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM554.PGRJ.942",
          last_modified_timestamp: 1692633292965,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:52",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Right)",
            },
          ],
          uuid: "12ef2bc519d442d4685ee956ccd18ccc",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:52"],
      },
      {
        _id: "d1dcab2df80590d8cd8770948abaf976",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM545.ZDPS.746",
          last_modified_timestamp: 1692633290041,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:50",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "d1dcab2df80590d8cd8770948abaf976",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:50"],
      },
      {
        _id: "546b59bd62a6c58307d439009ef76cbe",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM758.SQVJ.597",
          last_modified_timestamp: 1692633287052,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:47",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "546b59bd62a6c58307d439009ef76cbe",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:47"],
      },
      {
        _id: "65737bdc1a83b6a697430e1f6055748c",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM494.CRGT.577",
          last_modified_timestamp: 1692633283949,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:43",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Right)",
            },
          ],
          uuid: "65737bdc1a83b6a697430e1f6055748c",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:43"],
      },
      {
        _id: "4b1b34e27bccb2c3543d379d80c9f936",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM337.XRWN.985",
          last_modified_timestamp: 1692633280853,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:40",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "4b1b34e27bccb2c3543d379d80c9f936",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:40"],
      },
      {
        _id: "36d35a69e89330633ce6b05b4ad98e97",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM975.BJRS.622",
          last_modified_timestamp: 1692633277925,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:37",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Right)",
            },
          ],
          uuid: "36d35a69e89330633ce6b05b4ad98e97",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:37"],
      },
      {
        _id: "3276a898aa3ee5afbaf3368e1c9eb996",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM826.XDBN.955",
          last_modified_timestamp: 1692633274922,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:34",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "3276a898aa3ee5afbaf3368e1c9eb996",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:34"],
      },
      {
        _id: "a94f80ab8dc2a4e40c030e27e46e3b77",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM544.VSBJ.293",
          last_modified_timestamp: 1692633271325,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:31",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Right)",
            },
          ],
          uuid: "a94f80ab8dc2a4e40c030e27e46e3b77",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:31"],
      },
      {
        _id: "0066713ca95c03c52cb40f90ce8bbdb8",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM493.VRQM.643",
          last_modified_timestamp: 1692633268686,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:28",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "0066713ca95c03c52cb40f90ce8bbdb8",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:28"],
      },
      {
        _id: "fad77594f6ee5c43f0da2d864ac26e02",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM862.DKNM.597",
          last_modified_timestamp: 1692633265662,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:25",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "fad77594f6ee5c43f0da2d864ac26e02",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:25"],
      },
      {
        _id: "05e7b4e244631a85240ee968a584a7b4",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM229.MHGL.765",
          last_modified_timestamp: 1692633262629,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:22",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "05e7b4e244631a85240ee968a584a7b4",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:22"],
      },
      {
        _id: "2fdbf2be6b297eb1951b11db5b79cadb",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM777.STQB.672",
          last_modified_timestamp: 1692633259740,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:19",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "2fdbf2be6b297eb1951b11db5b79cadb",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:19"],
      },
      {
        _id: "4fd44a84d70deb0be8a80ff6add2e4cf",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM632.SGXL.444",
          last_modified_timestamp: 1692633256773,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:16",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "4fd44a84d70deb0be8a80ff6add2e4cf",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:16"],
      },
      {
        _id: "3aaa0b6d2fac29e1a9785414699a2f04",
        _index: "hm_dev_public_portal",
        _score: null,
        _source: {
          descendant_counts: {
            entity_type: {
              Dataset: 1,
            },
          },
          group_name: "Vanderbilt TMC",
          hubmap_id: "HBM959.MGHL.844",
          last_modified_timestamp: 1692633253758,
          mapped_data_types: ["MALDI IMS"],
          mapped_last_modified_timestamp: "2023-08-21 15:54:13",
          mapped_status: "Published",
          origin_samples: [
            {
              mapped_organ: "Kidney (Left)",
            },
          ],
          uuid: "3aaa0b6d2fac29e1a9785414699a2f04",
        },
        _type: "_doc",
        sort: ["2023-08-21 15:54:13"],
      },
    ],
    max_score: null,
    total: {
      relation: "eq",
      value: 89,
    },
  },
  timed_out: false,
  took: 34,
};

export default response;
