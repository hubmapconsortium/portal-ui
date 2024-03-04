const response = {
  "_shards": {
      "failed": 0,
      "skipped": 0,
      "successful": 5,
      "total": 5
  },
  "aggregations": {
      "ancestor_ids15": {
          "ancestor_ids.keyword": {
              "buckets": [
                  {
                      "doc_count": 161,
                      "key": "1628b6f7eb615862322d6274a6bc9fa0"
                  },
                  {
                      "doc_count": 125,
                      "key": "0e1c2d399477b244ac006eb58918ec0c"
                  },
                  {
                      "doc_count": 125,
                      "key": "4397fcd072ac96299992b47da1dbae64"
                  },
                  {
                      "doc_count": 110,
                      "key": "909b44eb01033314b357a3692b583387"
                  },
                  {
                      "doc_count": 110,
                      "key": "d3ad6409d2ad37ef7dbcc90ccc199f68"
                  }
              ],
              "doc_count_error_upper_bound": 57,
              "sum_other_doc_count": 9734
          },
          "ancestor_ids.keyword_count": {
              "value": 2848
          },
          "doc_count": 2206
      },
      "created_by_user_displayname14": {
          "created_by_user_displayname.keyword": {
              "buckets": [
                  {
                      "doc_count": 1059,
                      "key": "HuBMAP Process"
                  },
                  {
                      "doc_count": 382,
                      "key": "Joel Welling"
                  },
                  {
                      "doc_count": 180,
                      "key": "Daniel Cotter"
                  },
                  {
                      "doc_count": 132,
                      "key": "Juan Puerto"
                  },
                  {
                      "doc_count": 101,
                      "key": "Blue Lake"
                  }
              ],
              "doc_count_error_upper_bound": 6,
              "sum_other_doc_count": 352
          },
          "created_by_user_displayname.keyword_count": {
              "value": 22
          },
          "doc_count": 2206
      },
      "descendant_ids17": {
          "descendant_ids.keyword": {
              "buckets": [
                  {
                      "doc_count": 27,
                      "key": "0ceef5e22255ddcfbaa018ed321d703f"
                  },
                  {
                      "doc_count": 27,
                      "key": "88da2b6fb3f32e4236c892ec98a75467"
                  },
                  {
                      "doc_count": 27,
                      "key": "eb975811a1a3005622c4da37d948117e"
                  },
                  {
                      "doc_count": 21,
                      "key": "6501730e10d3b95b8db217c245b4ddfa"
                  },
                  {
                      "doc_count": 21,
                      "key": "aea510e37bc0f1287735f963cff7f671"
                  }
              ],
              "doc_count_error_upper_bound": 17,
              "sum_other_doc_count": 2696
          },
          "descendant_ids.keyword_count": {
              "value": 1871
          },
          "doc_count": 2206
      },
      "donor.mapped_metadata.age_value10": {
          "doc_count": 2206,
          "donor.mapped_metadata.age_value": {
              "buckets": [
                  {
                      "doc_count": 32,
                      "key": 0
                  },
                  {
                      "doc_count": 2,
                      "key": 5
                  },
                  {
                      "doc_count": 43,
                      "key": 10
                  },
                  {
                      "doc_count": 87,
                      "key": 15
                  },
                  {
                      "doc_count": 290,
                      "key": 20
                  },
                  {
                      "doc_count": 169,
                      "key": 25
                  },
                  {
                      "doc_count": 102,
                      "key": 30
                  },
                  {
                      "doc_count": 372,
                      "key": 35
                  },
                  {
                      "doc_count": 77,
                      "key": 40
                  },
                  {
                      "doc_count": 80,
                      "key": 45
                  },
                  {
                      "doc_count": 139,
                      "key": 50
                  },
                  {
                      "doc_count": 220,
                      "key": 55
                  },
                  {
                      "doc_count": 86,
                      "key": 60
                  },
                  {
                      "doc_count": 299,
                      "key": 65
                  },
                  {
                      "doc_count": 21,
                      "key": 70
                  },
                  {
                      "doc_count": 187,
                      "key": 75
                  },
                  {
                      "doc_count": 0,
                      "key": 80
                  },
                  {
                      "doc_count": 0,
                      "key": 85
                  },
                  {
                      "doc_count": 0,
                      "key": 90
                  },
                  {
                      "doc_count": 0,
                      "key": 95
                  },
                  {
                      "doc_count": 0,
                      "key": 100
                  }
              ]
          }
      },
      "donor.mapped_metadata.body_mass_index_value12": {
          "doc_count": 2017,
          "donor.mapped_metadata.body_mass_index_value": {
              "buckets": [
                  {
                      "doc_count": 0,
                      "key": 0
                  },
                  {
                      "doc_count": 0,
                      "key": 3
                  },
                  {
                      "doc_count": 0,
                      "key": 6
                  },
                  {
                      "doc_count": 0,
                      "key": 9
                  },
                  {
                      "doc_count": 0,
                      "key": 12
                  },
                  {
                      "doc_count": 6,
                      "key": 15
                  },
                  {
                      "doc_count": 250,
                      "key": 18
                  },
                  {
                      "doc_count": 357,
                      "key": 21
                  },
                  {
                      "doc_count": 160,
                      "key": 24
                  },
                  {
                      "doc_count": 489,
                      "key": 27
                  },
                  {
                      "doc_count": 392,
                      "key": 30
                  },
                  {
                      "doc_count": 222,
                      "key": 33
                  },
                  {
                      "doc_count": 69,
                      "key": 36
                  },
                  {
                      "doc_count": 25,
                      "key": 39
                  },
                  {
                      "doc_count": 16,
                      "key": 42
                  },
                  {
                      "doc_count": 20,
                      "key": 45
                  },
                  {
                      "doc_count": 11,
                      "key": 48
                  }
              ]
          }
      },
      "donor.mapped_metadata.race11": {
          "doc_count": 2206,
          "donor.mapped_metadata.race.keyword": {
              "buckets": [
                  {
                      "doc_count": 1520,
                      "key": "White"
                  },
                  {
                      "doc_count": 551,
                      "key": "Black or African American"
                  },
                  {
                      "doc_count": 97,
                      "key": "Unknown"
                  },
                  {
                      "doc_count": 31,
                      "key": "Asian"
                  },
                  {
                      "doc_count": 18,
                      "key": "Hispanic"
                  }
              ],
              "doc_count_error_upper_bound": 0,
              "sum_other_doc_count": 7
          },
          "donor.mapped_metadata.race.keyword_count": {
              "value": 7
          }
      },
      "donor.mapped_metadata.sex9": {
          "doc_count": 2206,
          "donor.mapped_metadata.sex.keyword": {
              "buckets": [
                  {
                      "doc_count": 1169,
                      "key": "Male"
                  },
                  {
                      "doc_count": 1029,
                      "key": "Female"
                  }
              ],
              "doc_count_error_upper_bound": 0,
              "sum_other_doc_count": 0
          },
          "donor.mapped_metadata.sex.keyword_count": {
              "value": 2
          }
      },
      "entity_type16": {
          "doc_count": 4605,
          "entity_type.keyword": {
              "buckets": [
                  {
                      "doc_count": 2206,
                      "key": "Dataset"
                  },
                  {
                      "doc_count": 1843,
                      "key": "Sample"
                  },
                  {
                      "doc_count": 315,
                      "key": "Support"
                  },
                  {
                      "doc_count": 214,
                      "key": "Donor"
                  },
                  {
                      "doc_count": 18,
                      "key": "Collection"
                  }
              ],
              "doc_count_error_upper_bound": 0,
              "sum_other_doc_count": 9
          },
          "entity_type.keyword_count": {
              "value": 6
          }
      },
      "group_name13": {
          "doc_count": 2206,
          "group_name.keyword": {
              "buckets": [
                  {
                      "doc_count": 716,
                      "key": "Stanford TMC"
                  },
                  {
                      "doc_count": 546,
                      "key": "University of California San Diego TMC"
                  },
                  {
                      "doc_count": 297,
                      "key": "Vanderbilt TMC"
                  },
                  {
                      "doc_count": 211,
                      "key": "Stanford RTI"
                  },
                  {
                      "doc_count": 192,
                      "key": "University of Florida TMC"
                  }
              ],
              "doc_count_error_upper_bound": 0,
              "sum_other_doc_count": 244
          },
          "group_name.keyword_count": {
              "value": 14
          }
      },
      "mapped_consortium8": {
          "doc_count": 2206,
          "mapped_consortium.keyword": {
              "buckets": [
                  {
                      "doc_count": 2196,
                      "key": "HuBMAP"
                  },
                  {
                      "doc_count": 10,
                      "key": "Human Cell Atlas"
                  }
              ],
              "doc_count_error_upper_bound": 0,
              "sum_other_doc_count": 0
          },
          "mapped_consortium.keyword_count": {
              "value": 2
          }
      },
      "mapped_data_types4": {
          "doc_count": 2206,
          "mapped_data_types.keyword": {
              "buckets": [
                  {
                      "doc_count": 102,
                      "key": "Autofluorescence Microscopy"
                  },
                  {
                      "doc_count": 16,
                      "key": "Bulk ATAC-seq"
                  },
                  {
                      "doc_count": 8,
                      "key": "Bulk ATAC-seq [BWA + MACS2]"
                  },
                  {
                      "doc_count": 8,
                      "key": "Bulk RNA-seq"
                  },
                  {
                      "doc_count": 8,
                      "key": "Bulk RNA-seq [Salmon]"
                  }
              ],
              "doc_count_error_upper_bound": 0,
              "sum_other_doc_count": 2064
          },
          "mapped_data_types.keyword_count": {
              "value": 43
          }
      },
      "mapped_status-mapped_data_access_level": {
          "doc_count": 2206,
          "mapped_status.keyword": {
              "doc_count": 2206,
              "mapped_status.keyword": {
                  "buckets": [
                      {
                          "doc_count": 2206,
                          "key": "Published"
                      }
                  ],
                  "doc_count_error_upper_bound": 0,
                  "sum_other_doc_count": 0
              }
          }
      },
      "origin_samples.mapped_organ5": {
          "doc_count": 2206,
          "origin_samples.mapped_organ.keyword": {
              "buckets": [
                  {
                      "doc_count": 423,
                      "key": "Kidney (Left)"
                  },
                  {
                      "doc_count": 368,
                      "key": "Kidney (Right)"
                  },
                  {
                      "doc_count": 367,
                      "key": "Small Intestine"
                  },
                  {
                      "doc_count": 359,
                      "key": "Large Intestine"
                  },
                  {
                      "doc_count": 211,
                      "key": "Uterus"
                  }
              ],
              "doc_count_error_upper_bound": 0,
              "sum_other_doc_count": 482
          },
          "origin_samples.mapped_organ.keyword_count": {
              "value": 17
          }
      },
      "source_samples.sample_category6": {
          "doc_count": 2206,
          "source_samples.sample_category.keyword": {
              "buckets": [
                  {
                      "doc_count": 1262,
                      "key": "section"
                  },
                  {
                      "doc_count": 878,
                      "key": "block"
                  },
                  {
                      "doc_count": 62,
                      "key": "suspension"
                  },
                  {
                      "doc_count": 4,
                      "key": "organ"
                  }
              ],
              "doc_count_error_upper_bound": 0,
              "sum_other_doc_count": 0
          },
          "source_samples.sample_category.keyword_count": {
              "value": 4
          }
      }
  },
  "hits": {
      "hits": [
          {
              "_id": "ef021aa2ee54036281322c248ffe7498",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM978.CGGC.988",
                  "last_modified_timestamp": 1709319988425,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:06:28",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Left)"
                      }
                  ],
                  "uuid": "ef021aa2ee54036281322c248ffe7498"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:06:28"
              ]
          },
          {
              "_id": "e2b8528c5ef37b55b2cc5076db873d0d",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM964.CZLM.657",
                  "last_modified_timestamp": 1709319985466,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:06:25",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Right)"
                      }
                  ],
                  "uuid": "e2b8528c5ef37b55b2cc5076db873d0d"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:06:25"
              ]
          },
          {
              "_id": "05473e0ef355dc349f32dd3e6bce828d",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM947.VKMP.764",
                  "last_modified_timestamp": 1709319982532,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:06:22",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Left)"
                      }
                  ],
                  "uuid": "05473e0ef355dc349f32dd3e6bce828d"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:06:22"
              ]
          },
          {
              "_id": "29030bd1d340fece52eca13654bc6de2",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM939.TZWB.238",
                  "last_modified_timestamp": 1709319979669,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:06:19",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Left)"
                      }
                  ],
                  "uuid": "29030bd1d340fece52eca13654bc6de2"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:06:19"
              ]
          },
          {
              "_id": "71642e4c4a9cc12f59f3317b4a19adc9",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM846.FTPG.677",
                  "last_modified_timestamp": 1709319976785,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:06:16",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Left)"
                      }
                  ],
                  "uuid": "71642e4c4a9cc12f59f3317b4a19adc9"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:06:16"
              ]
          },
          {
              "_id": "6b7db054a42b28697824dffec804aac9",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM837.XGBD.427",
                  "last_modified_timestamp": 1709319973965,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:06:13",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Right)"
                      }
                  ],
                  "uuid": "6b7db054a42b28697824dffec804aac9"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:06:13"
              ]
          },
          {
              "_id": "0dc53cf7e5500c177c12de7c1e662f37",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM759.LQKN.226",
                  "last_modified_timestamp": 1709319971053,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:06:11",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Right)"
                      }
                  ],
                  "uuid": "0dc53cf7e5500c177c12de7c1e662f37"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:06:11"
              ]
          },
          {
              "_id": "7305f4e3c4e91039c8c3da5075fe49ee",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM654.GRHB.837",
                  "last_modified_timestamp": 1709319968028,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:06:08",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Right)"
                      }
                  ],
                  "uuid": "7305f4e3c4e91039c8c3da5075fe49ee"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:06:08"
              ]
          },
          {
              "_id": "4862b7e59f5d41544e8aed51fb844fc0",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM593.DVGN.469",
                  "last_modified_timestamp": 1709319965067,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:06:05",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Left)"
                      }
                  ],
                  "uuid": "4862b7e59f5d41544e8aed51fb844fc0"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:06:05"
              ]
          },
          {
              "_id": "7718ad35fe468b3f5453a41c3517e715",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM538.XVLP.889",
                  "last_modified_timestamp": 1709319961968,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:06:01",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Left)"
                      }
                  ],
                  "uuid": "7718ad35fe468b3f5453a41c3517e715"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:06:01"
              ]
          },
          {
              "_id": "3d7dcf330f063c3dbf95bfc9344b9b5c",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM535.BDNV.724",
                  "last_modified_timestamp": 1709319959036,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:05:59",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Left)"
                      }
                  ],
                  "uuid": "3d7dcf330f063c3dbf95bfc9344b9b5c"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:05:59"
              ]
          },
          {
              "_id": "631ce2367da6ad5a1d5fc520f975c12e",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM486.KPCH.364",
                  "last_modified_timestamp": 1709319955875,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:05:55",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Right)"
                      }
                  ],
                  "uuid": "631ce2367da6ad5a1d5fc520f975c12e"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:05:55"
              ]
          },
          {
              "_id": "c6826367fb97432151a1b035e0104ed8",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM337.ZVPK.369",
                  "last_modified_timestamp": 1709319952705,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:05:52",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Right)"
                      }
                  ],
                  "uuid": "c6826367fb97432151a1b035e0104ed8"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:05:52"
              ]
          },
          {
              "_id": "9a2e171e15c07ca825ce72307e96316f",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM297.RSTP.985",
                  "last_modified_timestamp": 1709319949794,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:05:49",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Right)"
                      }
                  ],
                  "uuid": "9a2e171e15c07ca825ce72307e96316f"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:05:49"
              ]
          },
          {
              "_id": "9ea18d6339027da765da855f63016f79",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM987.NCDW.845",
                  "last_modified_timestamp": 1709319947057,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:05:47",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Right)"
                      }
                  ],
                  "uuid": "9ea18d6339027da765da855f63016f79"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:05:47"
              ]
          },
          {
              "_id": "cc795c343b816390cd739993360a81b3",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM957.LDNV.942",
                  "last_modified_timestamp": 1709319944098,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:05:44",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Left)"
                      }
                  ],
                  "uuid": "cc795c343b816390cd739993360a81b3"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:05:44"
              ]
          },
          {
              "_id": "242928390eea3978f3c4592165de7290",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "Vanderbilt TMC",
                  "hubmap_id": "HBM884.QGXZ.934",
                  "last_modified_timestamp": 1709319941310,
                  "mapped_data_types": [
                      "PAS Stained Microscopy"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:05:41",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Kidney (Left)"
                      }
                  ],
                  "uuid": "242928390eea3978f3c4592165de7290"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:05:41"
              ]
          },
          {
              "_id": "ab181e8ef53fcf893acb838c893befbf",
              "_index": "hm_prod_public_portal",
              "_score": null,
              "_source": {
                  "descendant_counts": {
                      "entity_type": {
                          "Dataset": 1
                      }
                  },
                  "group_name": "TTD - Penn State University and Columbia University",
                  "hubmap_id": "HBM875.FTTV.999",
                  "last_modified_timestamp": 1709319938569,
                  "mapped_data_types": [
                      "DESI"
                  ],
                  "mapped_last_modified_timestamp": "2024-03-01 19:05:38",
                  "mapped_status": "Published",
                  "origin_samples": [
                      {
                          "mapped_organ": "Liver"
                      }
                  ],
                  "uuid": "ab181e8ef53fcf893acb838c893befbf"
              },
              "_type": "_doc",
              "sort": [
                  "2024-03-01 19:05:38"
              ]
          }
      ],
      "max_score": null,
      "total": {
          "relation": "eq",
          "value": 2206
      }
  },
  "timed_out": false,
  "took": 26
}

export default response;
