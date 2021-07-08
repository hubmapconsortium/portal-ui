/*
This is the default request from the dataset search page.
You should not be authenticated when making this request.
Request url: https://search.api.hubmapconsortium.org/portal/search
Request body:
{
  query: { bool: { must_not: { exists: { field: "next_revision_uuid" } } } },
  post_filter: { term: { "entity_type.keyword": "Dataset" } },
  aggs: {
    mapped_data_types4: {
      filter: { term: { "entity_type.keyword": "Dataset" } },
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
      filter: { term: { "entity_type.keyword": "Dataset" } },
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
      filter: { term: { "entity_type.keyword": "Dataset" } },
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
      filter: { term: { "entity_type.keyword": "Dataset" } },
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
      filter: { term: { "entity_type.keyword": "Dataset" } },
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
      filter: { term: { "entity_type.keyword": "Dataset" } },
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
      filter: { term: { "entity_type.keyword": "Dataset" } },
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
      filter: { term: { "entity_type.keyword": "Dataset" } },
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
      filter: { match_all: {} },
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
    "hubmap_id",
    "group_name",
    "mapped_data_types",
    "origin_sample.mapped_organ",
    "mapped_status",
    "mapped_last_modified_timestamp",
    "last_modified_timestamp",
    "descendant_counts.entity_type",
    "uuid",
  ],
};
*/

const response = {
  _shards: { failed: 0, skipped: 0, successful: 5, total: 5 },
  aggregations: {
    ancestor_ids14: {
      "ancestor_ids.keyword": {
        buckets: [
          { doc_count: 94, key: "1628b6f7eb615862322d6274a6bc9fa0" },
          { doc_count: 51, key: "068aef7b9a77c6c61b85ad69cc8cf0d5" },
          { doc_count: 40, key: "18d84f25098b6b1699a7575d16722c5c" },
          { doc_count: 40, key: "2a88141ee11dfe080c01db3620a35a39" },
          { doc_count: 40, key: "3439871e0617807d2711465a249af9a5" },
        ],
        doc_count_error_upper_bound: 23,
        sum_other_doc_count: 1962,
      },
      "ancestor_ids.keyword_count": { value: 577 },
      doc_count: 451,
    },
    created_by_user_displayname13: {
      "created_by_user_displayname.keyword": {
        buckets: [
          { doc_count: 139, key: "HuBMAP Process" },
          { doc_count: 80, key: "Daniel Cotter" },
          { doc_count: 76, key: "Jeff Spraggins" },
          { doc_count: 72, key: "Blue Lake" },
          { doc_count: 48, key: "Jesus Penaloza Aponte" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 36,
      },
      "created_by_user_displayname.keyword_count": { value: 9 },
      doc_count: 451,
    },
    "donor.mapped_metadata.age_value9": {
      doc_count: 451,
      "donor.mapped_metadata.age_value": {
        buckets: [
          { doc_count: 34, key: 0.0 },
          { doc_count: 0, key: 5.0 },
          { doc_count: 14, key: 10.0 },
          { doc_count: 48, key: 15.0 },
          { doc_count: 1, key: 20.0 },
          { doc_count: 80, key: 25.0 },
          { doc_count: 13, key: 30.0 },
          { doc_count: 2, key: 35.0 },
          { doc_count: 20, key: 40.0 },
          { doc_count: 11, key: 45.0 },
          { doc_count: 13, key: 50.0 },
          { doc_count: 55, key: 55.0 },
          { doc_count: 20, key: 60.0 },
          { doc_count: 115, key: 65.0 },
          { doc_count: 15, key: 70.0 },
          { doc_count: 10, key: 75.0 },
          { doc_count: 0, key: 80.0 },
          { doc_count: 0, key: 85.0 },
          { doc_count: 0, key: 90.0 },
          { doc_count: 0, key: 95.0 },
          { doc_count: 0, key: 100.0 },
        ],
      },
    },
    "donor.mapped_metadata.body_mass_index_value11": {
      doc_count: 451,
      "donor.mapped_metadata.body_mass_index_value": {
        buckets: [
          { doc_count: 0, key: 0.0 },
          { doc_count: 0, key: 3.0 },
          { doc_count: 0, key: 6.0 },
          { doc_count: 0, key: 9.0 },
          { doc_count: 14, key: 12.0 },
          { doc_count: 0, key: 15.0 },
          { doc_count: 58, key: 18.0 },
          { doc_count: 68, key: 21.0 },
          { doc_count: 49, key: 24.0 },
          { doc_count: 56, key: 27.0 },
          { doc_count: 127, key: 30.0 },
          { doc_count: 64, key: 33.0 },
          { doc_count: 10, key: 36.0 },
          { doc_count: 0, key: 39.0 },
          { doc_count: 2, key: 42.0 },
          { doc_count: 2, key: 45.0 },
          { doc_count: 1, key: 48.0 },
        ],
      },
    },
    "donor.mapped_metadata.race10": {
      doc_count: 451,
      "donor.mapped_metadata.race.keyword": {
        buckets: [
          { doc_count: 326, key: "White" },
          { doc_count: 125, key: "Black or African American" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "donor.mapped_metadata.race.keyword_count": { value: 2 },
    },
    "donor.mapped_metadata.sex8": {
      doc_count: 451,
      "donor.mapped_metadata.sex.keyword": {
        buckets: [
          { doc_count: 245, key: "Female" },
          { doc_count: 206, key: "Male" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "donor.mapped_metadata.sex.keyword_count": { value: 2 },
    },
    entity_type15: {
      doc_count: 830,
      "entity_type.keyword": {
        buckets: [
          { doc_count: 451, key: "Dataset" },
          { doc_count: 333, key: "Sample" },
          { doc_count: 33, key: "Donor" },
          { doc_count: 13, key: "Collection" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "entity_type.keyword_count": { value: 4 },
    },
    group_name12: {
      doc_count: 451,
      "group_name.keyword": {
        buckets: [
          { doc_count: 152, key: "Vanderbilt TMC" },
          { doc_count: 96, key: "University of Florida TMC" },
          { doc_count: 94, key: "Stanford TMC" },
          { doc_count: 80, key: "University of California San Diego TMC" },
          { doc_count: 29, key: "California Institute of Technology TMC" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      "group_name.keyword_count": { value: 5 },
    },
    mapped_data_types4: {
      doc_count: 451,
      "mapped_data_types.keyword": {
        buckets: [
          { doc_count: 72, key: "SNARE-seq" },
          { doc_count: 50, key: "Untargeted LC-MS" },
          { doc_count: 26, key: "CODEX [Cytokit + SPRM]" },
          { doc_count: 25, key: "CODEX" },
          { doc_count: 22, key: "PAS Stained Microscopy" },
        ],
        doc_count_error_upper_bound: 9,
        sum_other_doc_count: 256,
      },
      "mapped_data_types.keyword_count": { value: 33 },
    },
    "mapped_status-mapped_data_access_level": {
      doc_count: 451,
      "mapped_status.keyword": {
        doc_count: 451,
        "mapped_status.keyword": {
          buckets: [{ doc_count: 451, key: "Published" }],
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
      doc_count: 451,
      "source_sample.mapped_specimen_type.keyword": {
        buckets: [
          { doc_count: 134, key: "Fresh frozen tissue section" },
          { doc_count: 92, key: "FFPE slide" },
          { doc_count: 92, key: "Flash frozen, liquid nitrogen" },
          { doc_count: 80, key: "Cryosections/curls from fresh frozen OCT" },
          { doc_count: 27, key: "PFA fixed frozen OCT block" },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 26,
      },
      "source_sample.mapped_specimen_type.keyword_count": { value: 7 },
    },
  },
  hits: {
    hits: [
      {
        _id: "f9ae931b8b49252f150d7f8bf1d2d13f",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          hubmap_id: "HBM464.GFFC.829",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568280411,
          mapped_data_types: ["PAS Stained Microscopy [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-10-24 19:38:00",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "f9ae931b8b49252f150d7f8bf1d2d13f",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:38:00"],
      },
      {
        _id: "02372aa02897532a31d0100079a99aeb",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          hubmap_id: "HBM385.RWPR.397",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568280105,
          mapped_data_types: ["PAS Stained Microscopy [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-10-24 19:38:00",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "02372aa02897532a31d0100079a99aeb",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:38:00"],
      },
      {
        _id: "35c957ce0c5545f7bc059e711a7e0c45",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          hubmap_id: "HBM977.QSQZ.334",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568279485,
          mapped_data_types: ["PAS Stained Microscopy [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:59",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "35c957ce0c5545f7bc059e711a7e0c45",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:59"],
      },
      {
        _id: "ca224d0c1a0144240858490e3df46f83",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          hubmap_id: "HBM927.TLPG.546",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568279808,
          mapped_data_types: ["PAS Stained Microscopy [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:59",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "ca224d0c1a0144240858490e3df46f83",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:59"],
      },
      {
        _id: "37b178deabc0512bd38170bb415b097d",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          hubmap_id: "HBM227.QKNQ.293",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568279166,
          mapped_data_types: ["PAS Stained Microscopy [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:59",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Right)" },
          uuid: "37b178deabc0512bd38170bb415b097d",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:59"],
      },
      {
        _id: "2952bdd4435a1c2a73ade7a19c011d8d",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          hubmap_id: "HBM776.CRXP.464",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568278842,
          mapped_data_types: ["PAS Stained Microscopy [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:58",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "2952bdd4435a1c2a73ade7a19c011d8d",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:58"],
      },
      {
        _id: "93919067774f0d5d432dab906310955f",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          hubmap_id: "HBM667.HKTF.584",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568278542,
          mapped_data_types: ["PAS Stained Microscopy [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:58",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Right)" },
          uuid: "93919067774f0d5d432dab906310955f",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:58"],
      },
      {
        _id: "ad2019a182a2842e6a40f53fe8a9453a",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          hubmap_id: "HBM282.MTGK.779",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568278243,
          mapped_data_types: ["PAS Stained Microscopy [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:58",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "ad2019a182a2842e6a40f53fe8a9453a",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:58"],
      },
      {
        _id: "3d2c9295c0e05f4d81d23ee95e9dad23",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 1 } },
          hubmap_id: "HBM623.RPMC.638",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568277650,
          mapped_data_types: ["PAS Stained Microscopy"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:57",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "3d2c9295c0e05f4d81d23ee95e9dad23",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:57"],
      },
      {
        _id: "7d30e20e48830cc3e74e961da349f08d",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          hubmap_id: "HBM676.TDHK.358",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568277947,
          mapped_data_types: ["PAS Stained Microscopy [Image Pyramid]"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:57",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "7d30e20e48830cc3e74e961da349f08d",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:57"],
      },
      {
        _id: "751d7b4638d6bfe51756669a4f192c00",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 1 } },
          hubmap_id: "HBM636.ZPTS.368",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568277036,
          mapped_data_types: ["PAS Stained Microscopy"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:57",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Right)" },
          uuid: "751d7b4638d6bfe51756669a4f192c00",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:57"],
      },
      {
        _id: "46bab56124c61f7a66c50c3cde0aa596",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 1 } },
          hubmap_id: "HBM636.GVWP.354",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568276310,
          mapped_data_types: ["PAS Stained Microscopy"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:56",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "46bab56124c61f7a66c50c3cde0aa596",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:56"],
      },
      {
        _id: "47f4411d2eba0edaad6951c5cc1bc03b",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 1 } },
          hubmap_id: "HBM833.DBGG.252",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568275054,
          mapped_data_types: ["PAS Stained Microscopy"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:55",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "47f4411d2eba0edaad6951c5cc1bc03b",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:55"],
      },
      {
        _id: "20fea3266c0b545def76080a3f545d0a",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 1 } },
          hubmap_id: "HBM676.SNVK.793",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568275672,
          mapped_data_types: ["PAS Stained Microscopy"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:55",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "20fea3266c0b545def76080a3f545d0a",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:55"],
      },
      {
        _id: "d0be34d165e38dc3b9074aca578a1c46",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 1 } },
          hubmap_id: "HBM276.PGFS.693",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568274400,
          mapped_data_types: ["PAS Stained Microscopy"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:54",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "d0be34d165e38dc3b9074aca578a1c46",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:54"],
      },
      {
        _id: "8adc3c31ca84ec4b958ed20a7c4f4919",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 1 } },
          hubmap_id: "HBM875.QHDJ.259",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568273059,
          mapped_data_types: ["PAS Stained Microscopy"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:53",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "8adc3c31ca84ec4b958ed20a7c4f4919",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:53"],
      },
      {
        _id: "8d649002964c5c599b84ef38cac91410",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 1 } },
          hubmap_id: "HBM783.GJWP.694",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568273751,
          mapped_data_types: ["PAS Stained Microscopy"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:53",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Right)" },
          uuid: "8d649002964c5c599b84ef38cac91410",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:53"],
      },
      {
        _id: "7aed690c306ad4a8e08b7ec794e3a304",
        _index: "hm_public_portal",
        _score: null,
        _source: {
          descendant_counts: { entity_type: { Dataset: 1 } },
          hubmap_id: "HBM879.CDHB.995",
          group_name: "Vanderbilt TMC",
          last_modified_timestamp: 1603568272470,
          mapped_data_types: ["PAS Stained Microscopy"],
          mapped_last_modified_timestamp: "2020-10-24 19:37:52",
          mapped_status: "Published",
          origin_sample: { mapped_organ: "Kidney (Left)" },
          uuid: "7aed690c306ad4a8e08b7ec794e3a304",
        },
        _type: "_doc",
        sort: ["2020-10-24 19:37:52"],
      },
    ],
    max_score: null,
    total: { relation: "eq", value: 451 },
  },
  timed_out: false,
  took: 21,
};

export default response;
