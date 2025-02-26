import { HierarchicalTermValues, buildSearchLink } from '../search/store';

interface SearchURLTypes {
  entityType: 'Donor' | 'Dataset' | 'Sample';
  organTerms: string[];
  assay?: string;
  mappedAssay?: string;
  assayTypeMap?: Record<string, string[]>;
  donorRace?: string;
  donorSex?: string;
  analyteClass?: string;
  processingStatus?: string;
}

function getAssayFilterLink({
  assay,
  mappedAssay,
  assayTypeMap,
}: Pick<SearchURLTypes, 'assay' | 'mappedAssay' | 'assayTypeMap'>):
  | { raw_dataset_type: HierarchicalTermValues<string[]> }
  | Record<string, never> {
  if (!assayTypeMap || Object.keys(assayTypeMap).length === 0) {
    return {};
  }

  if (assay) {
    const mappedDatasetTypes = assayTypeMap[assay] ?? [];

    return {
      raw_dataset_type: {
        type: 'HIERARCHICAL',
        values: { [assay]: mappedDatasetTypes },
      },
    };
  }

  if (mappedAssay) {
    const parentAssay = Object.keys(assayTypeMap).find((key) => assayTypeMap[key].includes(mappedAssay));

    if (!parentAssay) {
      return {};
    }
    return {
      raw_dataset_type: {
        type: 'HIERARCHICAL',
        values: { [parentAssay]: [mappedAssay] },
      },
    };
  }

  return {};
}

function getSearchURL({
  entityType,
  organTerms,
  assay,
  mappedAssay,
  assayTypeMap,
  donorRace,
  donorSex,
  analyteClass,
  processingStatus,
}: SearchURLTypes) {
  return buildSearchLink({
    entity_type: entityType,
    filters: {
      ...(processingStatus && {
        processing: {
          type: 'TERM',
          values: [processingStatus],
        },
      }),
      ...(organTerms &&
        organTerms.length > 0 && {
          origin_samples_unique_mapped_organs: {
            type: 'TERM',
            values: organTerms,
          },
        }),
      ...(donorRace && {
        'donor.mapped_metadata.race': {
          type: 'TERM',
          values: [donorRace],
        },
      }),
      ...(donorSex && {
        'donor.mapped_metadata.sex': {
          type: 'TERM',
          values: [donorSex],
        },
      }),
      ...(analyteClass && {
        analyte_class: {
          type: 'TERM',
          values: [analyteClass],
        },
      }),
      ...(assayTypeMap &&
        Object.keys(assayTypeMap).length > 0 &&
        getAssayFilterLink({ assay, mappedAssay, assayTypeMap })),
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getOrganDataProducts(organName: string) {
  const dataProducts = [
    {
      data_product_id: 'f66d1c41-eab2-4c43-a54a-103ff989aff4',
      creation_time: '2024-07-22T19:36:13.608947Z',
      tissue: {
        tissuetype: 'Spleen',
        tissuecode: 'SP',
        uberoncode: 'UBERON:0002106',
      },
      dataSets: [
        {
          uuid: '35a639b983ff85728bdb3cbe0eac360a',
          hubmap_id: 'HBM536.GZQR.922',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'f71249f6e349fb9a99a3d4f08541cab4',
          hubmap_id: 'HBM388.MPQC.336',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '2ab4c834a887341b8746a3e42143d786',
          hubmap_id: 'HBM623.CWHD.575',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '391061b538480d6d630bdfec283c0293',
          hubmap_id: 'HBM689.XCBK.436',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'd9780d3f4eb9edfe275abaa32ff8633b',
          hubmap_id: 'HBM232.MLHJ.832',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '29a538c3ddb396dee26188ae1151da46',
          hubmap_id: 'HBM698.FWFH.998',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '14946a8eb12f2d787302f818b72fdc4e',
          hubmap_id: 'HBM468.VQQQ.574',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '7b99b447ffc977a3f6f890d32c7238b3',
          hubmap_id: 'HBM493.DHZJ.845',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '1ca63edfa35971f475c91d92f4a70cb0',
          hubmap_id: 'HBM447.RVJR.677',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '9a36e5319429ec6aca5a8a9fef401929',
          hubmap_id: 'HBM323.BVBV.658',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '8e2806ca447695e674889dba28506d38',
          hubmap_id: 'HBM726.GNCK.634',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'd48b7990d638dbede870ae9c1976e475',
          hubmap_id: 'HBM243.NBKL.825',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '046251c94ea0e79ee935dd3de57e093c',
          hubmap_id: 'HBM795.TFHS.265',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '3f678ab5cd7ed086ec0d2d4468fc5094',
          hubmap_id: 'HBM279.SLFX.335',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '319aafd9420a0c1c6f175d6a2ef060a9',
          hubmap_id: 'HBM995.NPWL.939',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'f412e76986c1012ea9589d545ed8f043',
          hubmap_id: 'HBM482.JGJX.834',
          annotation_metadata: {
            is_annotated: false,
          },
        },
      ],
      assay: {
        assayName: 'rna-seq',
      },
      download: 'https://hubmap-data-products.s3.amazonaws.com/f66d1c41-eab2-4c43-a54a-103ff989aff4/SP_processed.h5ad',
      download_raw: 'https://hubmap-data-products.s3.amazonaws.com/f66d1c41-eab2-4c43-a54a-103ff989aff4/SP_raw.h5ad',
      raw_file_size_bytes: 600385639,
      processed_file_sizes_bytes: 10968301950,
      raw_cell_type_counts: {},
      processed_cell_type_counts: {},
    },
    {
      data_product_id: 'eea1a852-ee1e-4e9d-9295-8eb08ae2df19',
      creation_time: '2024-10-31T17:32:13.035280Z',
      tissue: {
        tissuetype: 'Spleen',
        tissuecode: 'SP',
        uberoncode: 'UBERON:0002106',
      },
      dataSets: [
        {
          uuid: '35a639b983ff85728bdb3cbe0eac360a',
          hubmap_id: 'HBM536.GZQR.922',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'f71249f6e349fb9a99a3d4f08541cab4',
          hubmap_id: 'HBM388.MPQC.336',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '2ab4c834a887341b8746a3e42143d786',
          hubmap_id: 'HBM623.CWHD.575',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '391061b538480d6d630bdfec283c0293',
          hubmap_id: 'HBM689.XCBK.436',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'd9780d3f4eb9edfe275abaa32ff8633b',
          hubmap_id: 'HBM232.MLHJ.832',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '29a538c3ddb396dee26188ae1151da46',
          hubmap_id: 'HBM698.FWFH.998',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '14946a8eb12f2d787302f818b72fdc4e',
          hubmap_id: 'HBM468.VQQQ.574',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '7b99b447ffc977a3f6f890d32c7238b3',
          hubmap_id: 'HBM493.DHZJ.845',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '1ca63edfa35971f475c91d92f4a70cb0',
          hubmap_id: 'HBM447.RVJR.677',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '9a36e5319429ec6aca5a8a9fef401929',
          hubmap_id: 'HBM323.BVBV.658',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '8e2806ca447695e674889dba28506d38',
          hubmap_id: 'HBM726.GNCK.634',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'd48b7990d638dbede870ae9c1976e475',
          hubmap_id: 'HBM243.NBKL.825',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '046251c94ea0e79ee935dd3de57e093c',
          hubmap_id: 'HBM795.TFHS.265',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '3f678ab5cd7ed086ec0d2d4468fc5094',
          hubmap_id: 'HBM279.SLFX.335',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '319aafd9420a0c1c6f175d6a2ef060a9',
          hubmap_id: 'HBM995.NPWL.939',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'f412e76986c1012ea9589d545ed8f043',
          hubmap_id: 'HBM482.JGJX.834',
          annotation_metadata: {
            is_annotated: false,
          },
        },
      ],
      assay: {
        assayName: 'rna-seq',
      },
      download: 'https://hubmap-data-products.s3.amazonaws.com/eea1a852-ee1e-4e9d-9295-8eb08ae2df19/SP_processed.h5ad',
      download_raw: 'https://hubmap-data-products.s3.amazonaws.com/eea1a852-ee1e-4e9d-9295-8eb08ae2df19/SP_raw.h5ad',
      raw_file_size_bytes: 599289269,
      processed_file_sizes_bytes: 11036566694,
      raw_cell_type_counts: {},
      processed_cell_type_counts: {},
    },
    {
      data_product_id: 'f74d01ae-5e1e-482a-9a2c-c4480c43b1b2',
      creation_time: '2024-11-07T15:06:50.469932Z',
      tissue: {
        tissuetype: 'Spleen',
        tissuecode: 'SP',
        uberoncode: 'UBERON:0002106',
      },
      dataSets: [
        {
          uuid: '745514468a9ab6779a4c879e01ac8df2',
          hubmap_id: 'HBM882.DBTR.869',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'a71a75ea60d91e89675b04c1728a5a48',
          hubmap_id: 'HBM498.TCSV.345',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '2b57ac6fea7aa96d26d2685a297a4e7a',
          hubmap_id: 'HBM342.FSLD.938',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'd73a864f5ad6bdffdf148f43423e2a01',
          hubmap_id: 'HBM772.XXCD.697',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '3d14dcc3d7c3e0cd339c9366e34b37c7',
          hubmap_id: 'HBM543.RSRV.265',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '2c3540e2b1040c06612698d80ecab56a',
          hubmap_id: 'HBM427.SMGB.866',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'e0ba24d0c4dab528e46aab3f67a1aae8',
          hubmap_id: 'HBM987.XGTH.368',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'b7a2c05fdd9ddd0c83c9786ede98a24e',
          hubmap_id: 'HBM558.SRZG.629',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'aedc30c204870180673b6ece299f2eb1',
          hubmap_id: 'HBM244.TJLK.223',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'd36df353338a4a450f2282c65218f16c',
          hubmap_id: 'HBM633.CLVN.674',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '4a4c3947a7590031d1ff405557354fdb',
          hubmap_id: 'HBM647.MFQB.496',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '75edcda4f3ff5bef72383d5d082438c2',
          hubmap_id: 'HBM432.LLCF.677',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'f0c58e670ceb445e6ab02c6a20c83aee',
          hubmap_id: 'HBM337.FSXL.564',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '03043e079260d180099579045f16cd53',
          hubmap_id: 'HBM267.BZKT.867',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '1393ff7729eff13cd2f4d5d58af96fdb',
          hubmap_id: 'HBM389.PKHL.936',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'cacbcb64aa8d9e3160a4ff6600df081a',
          hubmap_id: 'HBM687.CWVH.758',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '98e2fdb35dfa5f1e2f3371cad9d05a83',
          hubmap_id: 'HBM374.LLKS.325',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'a8fe9587a1e754cf84aeda3f9177224e',
          hubmap_id: 'HBM659.XHFH.996',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '3de2804ec3219228758dba8382d33423',
          hubmap_id: 'HBM825.PBVN.284',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'afbd95090454842570908a76c80d1266',
          hubmap_id: 'HBM548.TSMP.663',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'efeae1a9895b88a4ccdbfa35dc98fdf2',
          hubmap_id: 'HBM968.CJLB.479',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'f9bb196bf1fe395b635731dbf523c6fa',
          hubmap_id: 'HBM724.PJNC.827',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '4c0479bd703d8be3c2834dd1b6773b4c',
          hubmap_id: 'HBM355.JDLK.244',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '654418415bed5ecb9596b17a0320a2c6',
          hubmap_id: 'HBM568.NGPL.345',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '00d1a3623dac388773bc7780fcb42797',
          hubmap_id: 'HBM556.KSFB.592',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '9d3a9425dad665ea8e26f554b2a23486',
          hubmap_id: 'HBM836.WNJS.587',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'dcdabfcfa50ecab40e1f2955a495f987',
          hubmap_id: 'HBM666.SDLF.468',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '9c9f27da754e677e7eeede464fd4c97d',
          hubmap_id: 'HBM733.DLLK.799',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'a119ccf25cb3e09127fe9919186f71b9',
          hubmap_id: 'HBM797.LKNL.358',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '026220c1ca153ffb3673ae70761bea63',
          hubmap_id: 'HBM864.JSLF.723',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '7fae3b98eb6047835d5c1011a2d63034',
          hubmap_id: 'HBM224.XXWB.669',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'a689dace3e9945b87c8743a6c3c4744e',
          hubmap_id: 'HBM528.NMQV.274',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'c4b216fbc950f8cdda0d261e585a2f3c',
          hubmap_id: 'HBM496.ZJFC.554',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '669c8cbd894e0c91a365e1c58a8d5865',
          hubmap_id: 'HBM362.QZWG.832',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '666d5c8292a7ef2e7cddc9fd22b1e0df',
          hubmap_id: 'HBM495.VWBD.428',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '0b02838e5b9d1217e3e5d2a8886b0ae9',
          hubmap_id: 'HBM273.LHDV.987',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'bf1e01bb3b747976fe59e2286448efeb',
          hubmap_id: 'HBM732.GQLB.743',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '29a16817f1337e0a0da1c3454ff99fe7',
          hubmap_id: 'HBM696.DSTM.687',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '3bf7c7b6444c3c3d6dbaf543e85cfc2b',
          hubmap_id: 'HBM396.BXSQ.568',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '68c78cbcbcd6d4d7aec0b9792f4cceee',
          hubmap_id: 'HBM443.TZCQ.232',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '22e83cfdaa13787d4d5796a927ce44d1',
          hubmap_id: 'HBM744.TGMS.672',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '7f539bf8404ff94e18a9af973a53b3f3',
          hubmap_id: 'HBM299.TTLG.749',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'cd345bb3ea5e91ea915ac8e0e66d235b',
          hubmap_id: 'HBM739.KJCB.594',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '777370c5177adc879eff551714480b84',
          hubmap_id: 'HBM455.XDQS.993',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '92ebf0fa057dd23ba334355a36191cd8',
          hubmap_id: 'HBM286.SKWF.837',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '19184e64b152cd9977f56785da9495fd',
          hubmap_id: 'HBM898.LWCS.878',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'eb95689aac982ed0224613850ea85d2d',
          hubmap_id: 'HBM452.ZQFK.527',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'aedf4d6e9dff37b9b6ebcf670382935f',
          hubmap_id: 'HBM893.FNLL.223',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '37581089fc2b39aab823a3093bc1381b',
          hubmap_id: 'HBM542.THBC.733',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '730f81640c6573165c6bab8f82356b34',
          hubmap_id: 'HBM573.GQRD.788',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '9358adf4674413a0e2ef1a970b66714e',
          hubmap_id: 'HBM594.PWXG.764',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'b6e00c907020456af2942d6c1576b100',
          hubmap_id: 'HBM946.WMTC.283',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '0008a49ac06f4afd886be81491a5a926',
          hubmap_id: 'HBM626.KXRZ.238',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '29b597eb148281332c8512b1ef38d580',
          hubmap_id: 'HBM455.PWQW.883',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '79ec9402362b276b9e12c0f596dbac4f',
          hubmap_id: 'HBM863.FDNH.844',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'b1b4493122e8965e3684b0a7a5dd270a',
          hubmap_id: 'HBM327.LNVF.877',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '2c70846a788a7b6900992b4ed310574d',
          hubmap_id: 'HBM825.KFFT.669',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '08e2ec17af557e638b5ffed2c162868f',
          hubmap_id: 'HBM766.SGJV.225',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: 'd2f39eb7da856f5ff344c2e907611b76',
          hubmap_id: 'HBM339.LBCC.963',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '586b77e11e6183de4363fe7a9385282f',
          hubmap_id: 'HBM279.RTXC.523',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '260ea057a33405dcf89d5466ea06021a',
          hubmap_id: 'HBM967.TGDD.996',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '8d8bea76f220b8abd7ef0f1a5a870f5f',
          hubmap_id: 'HBM327.NMZP.779',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '52c621b17d7a893cc124c3737a82498f',
          hubmap_id: 'HBM783.JZRN.564',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '69d9c52bc9edb625b496cecb623ec081',
          hubmap_id: 'HBM287.WDKX.539',
          annotation_metadata: {
            is_annotated: false,
          },
        },
        {
          uuid: '93171e9e163e03bace53c856c0ac57bb',
          hubmap_id: 'HBM762.TCMB.394',
          annotation_metadata: {
            is_annotated: false,
          },
        },
      ],
      assay: {
        assayName: 'codex',
      },
      download: 'None',
      download_raw: 'https://hubmap-data-products.s3.amazonaws.com/f74d01ae-5e1e-482a-9a2c-c4480c43b1b2/SP_raw.h5ad',
      raw_file_size_bytes: 2860093794,
      processed_file_sizes_bytes: 0,
      raw_cell_type_counts: {},
      processed_cell_type_counts: {},
    },
  ];

  const datasetProductsWithUUIDs = dataProducts.map((product) => {
    const datasetUUIDs = product.dataSets.map((dataset) => dataset.uuid);
    return { ...product, datasetUUIDs };
  });

  return { dataProducts: datasetProductsWithUUIDs };
}

export { getSearchURL, getOrganDataProducts };
