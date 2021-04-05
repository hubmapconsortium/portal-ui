/*
This search is for datasets with a heart organ type. The intent is to have less than 5 data types.
You should not be authenticated when making this request.
Request url: https://search.api.hubmapconsortium.org/portal/search
Request body:
{
  query: { bool: { must_not: { exists: { field: "next_revision_uuid" } } } },
  post_filter: {
    bool: {
      must: [
        { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
        { term: { "entity_type.keyword": "Dataset" } },
      ],
    },
  },
  aggs: {
    mapped_data_types4: {
      filter: {
        bool: {
          must: [
            { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
            { term: { "entity_type.keyword": "Dataset" } },
          ],
        },
      },
      aggs: {
        "mapped_data_types.keyword": {
          terms: { field: "mapped_data_types.keyword", size: 5 },
        },
        "mapped_data_types.keyword_count": {
          cardinality: { field: "mapped_data_types.keyword" },
        },
      },
    },
    "origin_sample.mapped_organ5": {
      filter: { term: { "entity_type.keyword": "Dataset" } },
      aggs: {
        "origin_sample.mapped_organ.keyword": {
          terms: { field: "origin_sample.mapped_organ.keyword", size: 5 },
        },
        "origin_sample.mapped_organ.keyword_count": {
          cardinality: { field: "origin_sample.mapped_organ.keyword" },
        },
      },
    },
    "source_sample.mapped_specimen_type6": {
      filter: {
        bool: {
          must: [
            { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
            { term: { "entity_type.keyword": "Dataset" } },
          ],
        },
      },
      aggs: {
        "source_sample.mapped_specimen_type.keyword": {
          terms: {
            field: "source_sample.mapped_specimen_type.keyword",
            size: 5,
          },
        },
        "source_sample.mapped_specimen_type.keyword_count": {
          cardinality: { field: "source_sample.mapped_specimen_type.keyword" },
        },
      },
    },
    "mapped_status-mapped_data_access_level": {
      filter: {
        bool: {
          must: [
            { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
            { term: { "entity_type.keyword": "Dataset" } },
          ],
        },
      },
      aggs: {
        "mapped_status.keyword": {
          filter: { match_all: {} },
          aggs: {
            "mapped_status.keyword": {
              terms: { field: "mapped_status.keyword", size: 20 },
            },
          },
        },
      },
    },
    "donor.mapped_metadata.sex8": {
      filter: {
        bool: {
          must: [
            { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
            { term: { "entity_type.keyword": "Dataset" } },
          ],
        },
      },
      aggs: {
        "donor.mapped_metadata.sex.keyword": {
          terms: { field: "donor.mapped_metadata.sex.keyword", size: 5 },
        },
        "donor.mapped_metadata.sex.keyword_count": {
          cardinality: { field: "donor.mapped_metadata.sex.keyword" },
        },
      },
    },
    "donor.mapped_metadata.age_value9": {
      filter: {
        bool: {
          must: [
            { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
            { term: { "entity_type.keyword": "Dataset" } },
            {
              range: {
                "donor.mapped_metadata.age_value": { gte: 0, lte: 100 },
              },
            },
          ],
        },
      },
      aggs: {
        "donor.mapped_metadata.age_value": {
          histogram: {
            field: "donor.mapped_metadata.age_value",
            interval: 5,
            min_doc_count: 0,
            extended_bounds: { min: 0, max: 100 },
          },
        },
      },
    },
    "donor.mapped_metadata.race10": {
      filter: {
        bool: {
          must: [
            { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
            { term: { "entity_type.keyword": "Dataset" } },
          ],
        },
      },
      aggs: {
        "donor.mapped_metadata.race.keyword": {
          terms: { field: "donor.mapped_metadata.race.keyword", size: 5 },
        },
        "donor.mapped_metadata.race.keyword_count": {
          cardinality: { field: "donor.mapped_metadata.race.keyword" },
        },
      },
    },
    "donor.mapped_metadata.body_mass_index_value11": {
      filter: {
        bool: {
          must: [
            { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
            { term: { "entity_type.keyword": "Dataset" } },
            {
              range: {
                "donor.mapped_metadata.body_mass_index_value": {
                  gte: 0,
                  lte: 50,
                },
              },
            },
          ],
        },
      },
      aggs: {
        "donor.mapped_metadata.body_mass_index_value": {
          histogram: {
            field: "donor.mapped_metadata.body_mass_index_value",
            interval: 3,
            min_doc_count: 0,
            extended_bounds: { min: 0, max: 50 },
          },
        },
      },
    },
    group_name12: {
      filter: {
        bool: {
          must: [
            { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
            { term: { "entity_type.keyword": "Dataset" } },
          ],
        },
      },
      aggs: {
        "group_name.keyword": {
          terms: { field: "group_name.keyword", size: 5 },
        },
        "group_name.keyword_count": {
          cardinality: { field: "group_name.keyword" },
        },
      },
    },
    created_by_user_displayname13: {
      filter: {
        bool: {
          must: [
            { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
            { term: { "entity_type.keyword": "Dataset" } },
          ],
        },
      },
      aggs: {
        "created_by_user_displayname.keyword": {
          terms: { field: "created_by_user_displayname.keyword", size: 5 },
        },
        "created_by_user_displayname.keyword_count": {
          cardinality: { field: "created_by_user_displayname.keyword" },
        },
      },
    },
    ancestor_ids14: {
      filter: {
        bool: {
          must: [
            { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
            { term: { "entity_type.keyword": "Dataset" } },
          ],
        },
      },
      aggs: {
        "ancestor_ids.keyword": {
          terms: { field: "ancestor_ids.keyword", size: 5 },
        },
        "ancestor_ids.keyword_count": {
          cardinality: { field: "ancestor_ids.keyword" },
        },
      },
    },
    entity_type15: {
      filter: { term: { "origin_sample.mapped_organ.keyword": "Heart" } },
      aggs: {
        "entity_type.keyword": {
          terms: { field: "entity_type.keyword", size: 5 },
        },
        "entity_type.keyword_count": {
          cardinality: { field: "entity_type.keyword" },
        },
      },
    },
  },
  size: 18,
  sort: [{ "mapped_last_modified_timestamp.keyword": "desc" }],
  highlight: { fields: { everything: { type: "plain" } } },
  _source: [
    "display_doi",
    "group_name",
    "mapped_data_types",
    "origin_sample.mapped_organ",
    "mapped_status",
    "mapped_last_modified_timestamp",
    "last_modified_timestamp",
    "descendant_counts.entity_type",
    "uuid",
  ],
}
*/

const response = {
  _shards: { failed: 0, skipped: 0, successful: 5, total: 5 },
  aggregations: {
    ancestor_ids14: {
      "ancestor_ids.keyword": {
        buckets: [
          { doc_count: 9, key: "36d34bbfc026545aeac0c5acd47f3f91" },
          { doc_count: 9, key: "a3ab4491d04dff03fdd2cee5a2df70b3" },
          { doc_count: 3, key: "3b20d9aa8a3a412a73a883e07d86d889" },
          { doc_count: 3, key: "402bced53653cb2a89af6a5432bc8cbb" },
          { doc_count: 3, key: "5bbf6c322b1d01653e50d8fc7c4c9337" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 24,
      },
      "ancestor_ids.keyword_count": { value: 16 },
      doc_count: 11,
    },
    created_by_user_displayname13: {
      "created_by_user_displayname.keyword": {
        buckets: [
          { doc_count: 6, key: "Nico Pierson" },
          { doc_count: 4, key: "HuBMAP Process" },
          { doc_count: 1, key: "Dana L Jackson" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "created_by_user_displayname.keyword_count": { value: 3 },
      doc_count: 11,
    },
    "donor.mapped_metadata.age_value9": {
      doc_count: 11,
      "donor.mapped_metadata.age_value": {
        buckets: [
          { doc_count: 0, key: 0.0 },
          { doc_count: 0, key: 5.0 },
          { doc_count: 0, key: 10.0 },
          { doc_count: 0, key: 15.0 },
          { doc_count: 0, key: 20.0 },
          { doc_count: 0, key: 25.0 },
          { doc_count: 0, key: 30.0 },
          { doc_count: 0, key: 35.0 },
          { doc_count: 9, key: 40.0 },
          { doc_count: 0, key: 45.0 },
          { doc_count: 2, key: 50.0 },
          { doc_count: 0, key: 55.0 },
          { doc_count: 0, key: 60.0 },
          { doc_count: 0, key: 65.0 },
          { doc_count: 0, key: 70.0 },
          { doc_count: 0, key: 75.0 },
          { doc_count: 0, key: 80.0 },
          { doc_count: 0, key: 85.0 },
          { doc_count: 0, key: 90.0 },
          { doc_count: 0, key: 95.0 },
          { doc_count: 0, key: 100.0 },
        ],
      },
    },
    "donor.mapped_metadata.body_mass_index_value11": {
      doc_count: 11,
      "donor.mapped_metadata.body_mass_index_value": {
        buckets: [
          { doc_count: 0, key: 0.0 },
          { doc_count: 0, key: 3.0 },
          { doc_count: 0, key: 6.0 },
          { doc_count: 0, key: 9.0 },
          { doc_count: 0, key: 12.0 },
          { doc_count: 0, key: 15.0 },
          { doc_count: 0, key: 18.0 },
          { doc_count: 0, key: 21.0 },
          { doc_count: 11, key: 24.0 },
          { doc_count: 0, key: 27.0 },
          { doc_count: 0, key: 30.0 },
          { doc_count: 0, key: 33.0 },
          { doc_count: 0, key: 36.0 },
          { doc_count: 0, key: 39.0 },
          { doc_count: 0, key: 42.0 },
          { doc_count: 0, key: 45.0 },
          { doc_count: 0, key: 48.0 },
        ],
      },
    },
    "donor.mapped_metadata.race10": {
      doc_count: 11,
      "donor.mapped_metadata.race.keyword": {
        buckets: [{ doc_count: 11, key: "Black or African American" }],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "donor.mapped_metadata.race.keyword_count": { value: 1 },
    },
    "donor.mapped_metadata.sex8": {
      doc_count: 11,
      "donor.mapped_metadata.sex.keyword": {
        buckets: [{ doc_count: 11, key: "Male" }],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "donor.mapped_metadata.sex.keyword_count": { value: 1 },
    },
    entity_type15: {
      doc_count: 21,
      "entity_type.keyword": {
        buckets: [
          { doc_count: 11, key: "Dataset" },
          { doc_count: 10, key: "Sample" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "entity_type.keyword_count": { value: 2 },
    },
    group_name12: {
      doc_count: 11,
      "group_name.keyword": {
        buckets: [
          { doc_count: 11, key: "California Institute of Technology TMC" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "group_name.keyword_count": { value: 1 },
    },
    mapped_data_types4: {
      doc_count: 11,
      "mapped_data_types.keyword": {
        buckets: [
          { doc_count: 3, key: "seqFISH" },
          { doc_count: 3, key: "seqFISH [Image Pyramid]" },
          { doc_count: 3, key: "seqFISH [Lab Processed]" },
          { doc_count: 1, key: "sciATAC-seq" },
          { doc_count: 1, key: "sciATAC-seq [SnapATAC]" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "mapped_data_types.keyword_count": { value: 5 },
    },
    "mapped_status-mapped_data_access_level": {
      doc_count: 11,
      "mapped_status.keyword": {
        doc_count: 11,
        "mapped_status.keyword": {
          buckets: [{ doc_count: 11, key: "Published" }],
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
        },
      },
    },
    "origin_sample.mapped_organ5": {
      doc_count: 451,
      "origin_sample.mapped_organ.keyword": {
        buckets: [
          { doc_count: 134, key: "Kidney (Left)" },
          { doc_count: 98, key: "Kidney (Right)" },
          { doc_count: 52, key: "Small Intestine" },
          { doc_count: 51, key: "Large Intestine" },
          { doc_count: 45, key: "Spleen" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 71,
      },
      "origin_sample.mapped_organ.keyword_count": { value: 8 },
    },
    "source_sample.mapped_specimen_type6": {
      doc_count: 11,
      "source_sample.mapped_specimen_type.keyword": {
        buckets: [
          { doc_count: 9, key: "PFA fixed frozen OCT block" },
          { doc_count: 2, key: "Flash frozen, liquid nitrogen" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "source_sample.mapped_specimen_type.keyword_count": { value: 2 },
    },
  },
  hits: {
    hits: [
      {
        _id: "d4493657cde29702c5ed73932da5317c",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          display_doi: "HBM626.JKSH.835",
          group_name: "California Institute of Technology TMC",
          last_modified_timestamp: 1598129555663,
          mapped_data_types: ["sciATAC-seq [SnapATAC]"],
          mapped_last_modified_timestamp: "2020-08-22 20:52:35",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Heart" },
          uuid: "d4493657cde29702c5ed73932da5317c",
        },
        _type: "_doc",
        sort: ["2020-08-22 20:52:35"],
      },
      {
        _id: "d926c41ac08f3c2ba5e61eec83e90b0c",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 1 } },
          display_doi: "HBM666.FFFW.363",
          group_name: "California Institute of Technology TMC",
          last_modified_timestamp: 1598129555354,
          mapped_data_types: ["sciATAC-seq"],
          mapped_last_modified_timestamp: "2020-08-22 20:52:35",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Heart" },
          uuid: "d926c41ac08f3c2ba5e61eec83e90b0c",
        },
        _type: "_doc",
        sort: ["2020-08-22 20:52:35"],
      },
      {
        _id: "b5707bbde0050121ca7291e30054d548",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          display_doi: "HBM266.ZZPW.922",
          group_name: "California Institute of Technology TMC",
          last_modified_timestamp: 1598129554155,
          mapped_data_types: ["seqFISH [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-08-22 20:52:34",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Heart" },
          uuid: "b5707bbde0050121ca7291e30054d548",
        },
        _type: "_doc",
        sort: ["2020-08-22 20:52:34"],
      },
      {
        _id: "9db61adfc017670a196ea9b3ca1852a0",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          display_doi: "HBM357.LBRF.256",
          group_name: "California Institute of Technology TMC",
          last_modified_timestamp: 1598129553531,
          mapped_data_types: ["seqFISH [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-08-22 20:52:33",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Heart" },
          uuid: "9db61adfc017670a196ea9b3ca1852a0",
        },
        _type: "_doc",
        sort: ["2020-08-22 20:52:33"],
      },
      {
        _id: "f91b925ab975d7f5997c51a72d9b1329",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          display_doi: "HBM377.PNXQ.838",
          group_name: "California Institute of Technology TMC",
          last_modified_timestamp: 1598129552343,
          mapped_data_types: ["seqFISH [Lab Processed]"],
          mapped_last_modified_timestamp: "2020-08-22 20:52:32",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Heart" },
          uuid: "f91b925ab975d7f5997c51a72d9b1329",
        },
        _type: "_doc",
        sort: ["2020-08-22 20:52:32"],
      },
      {
        _id: "07252baead231034202f5ffb9ecbb8e0",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          display_doi: "HBM987.FMBC.577",
          group_name: "California Institute of Technology TMC",
          last_modified_timestamp: 1598129552652,
          mapped_data_types: ["seqFISH [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-08-22 20:52:32",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Heart" },
          uuid: "07252baead231034202f5ffb9ecbb8e0",
        },
        _type: "_doc",
        sort: ["2020-08-22 20:52:32"],
      },
      {
        _id: "ceab8754162592b4014093f09881a47c",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          display_doi: "HBM374.JBKR.938",
          group_name: "California Institute of Technology TMC",
          last_modified_timestamp: 1598129551973,
          mapped_data_types: ["seqFISH [Lab Processed]"],
          mapped_last_modified_timestamp: "2020-08-22 20:52:31",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Heart" },
          uuid: "ceab8754162592b4014093f09881a47c",
        },
        _type: "_doc",
        sort: ["2020-08-22 20:52:31"],
      },
      {
        _id: "9f37a9b1f6073e6e588ff7e0dd9493b5",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          display_doi: "HBM395.JHDT.249",
          group_name: "California Institute of Technology TMC",
          last_modified_timestamp: 1598129550975,
          mapped_data_types: ["seqFISH [Lab Processed]"],
          mapped_last_modified_timestamp: "2020-08-22 20:52:30",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Heart" },
          uuid: "9f37a9b1f6073e6e588ff7e0dd9493b5",
        },
        _type: "_doc",
        sort: ["2020-08-22 20:52:30"],
      },
      {
        _id: "eaad5ed4b3aa2186bd87e05ff28b593e",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 2 } },
          display_doi: "HBM434.VLFT.986",
          group_name: "California Institute of Technology TMC",
          last_modified_timestamp: 1598129549427,
          mapped_data_types: ["seqFISH"],
          mapped_last_modified_timestamp: "2020-08-22 20:52:29",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Heart" },
          uuid: "eaad5ed4b3aa2186bd87e05ff28b593e",
        },
        _type: "_doc",
        sort: ["2020-08-22 20:52:29"],
      },
      {
        _id: "c6a254b2dc2ed46b002500ade163a7cc",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 2 } },
          display_doi: "HBM965.GZHL.485",
          group_name: "California Institute of Technology TMC",
          last_modified_timestamp: 1598129548433,
          mapped_data_types: ["seqFISH"],
          mapped_last_modified_timestamp: "2020-08-22 20:52:28",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Heart" },
          uuid: "c6a254b2dc2ed46b002500ade163a7cc",
        },
        _type: "_doc",
        sort: ["2020-08-22 20:52:28"],
      },
      {
        _id: "8f0becaf2d0eea9df67e45b8d66d69ac",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 2 } },
          display_doi: "HBM788.KHPF.569",
          group_name: "California Institute of Technology TMC",
          last_modified_timestamp: 1598129546989,
          mapped_data_types: ["seqFISH"],
          mapped_last_modified_timestamp: "2020-08-22 20:52:26",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Heart" },
          uuid: "8f0becaf2d0eea9df67e45b8d66d69ac",
        },
        _type: "_doc",
        sort: ["2020-08-22 20:52:26"],
      },
    ],
    max_score: null,
    total: { relation: "eq", value: 11 },
  },
  timed_out: false,
  took: 11,
};

export default response;
