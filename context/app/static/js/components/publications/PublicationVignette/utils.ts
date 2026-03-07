/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment*/

/**
 * @param {object} config The "template" config containing URLs with "{{ base_url }}".
 * @param {function} handleUrl Function that takes in a (potentially template) URL string and returns a filled-in URL string.
 * @returns {object} The config with handleUrl having been called to process every URL.
 */

import { VitessceConfig } from 'vitessce';

const fillUrls = (
  config: VitessceConfig,
  handleUrl: (url: string, isZarr: boolean) => string,
  handleRequestInit: () => RequestInit,
) => {
  return {
    ...config,
    // @ts-expect-error - the config.datasets type is not well defined in the VitessceConfig type definition, so we have to use any here
    datasets: config.datasets.map((datasetDef: any) => {
      return {
        ...datasetDef,
        files: datasetDef.files.map((fileDef: any) => {
          return {
            ...fileDef,
            ...(fileDef.url
              ? {
                  url: handleUrl(fileDef.url, fileDef.fileType.includes('zarr')),
                }
              : {}),
            ...(fileDef.fileType.includes('zarr')
              ? {
                  requestInit: handleRequestInit(),
                }
              : {}),
            ...(fileDef.options?.images
              ? {
                  options: {
                    ...fileDef.options,
                    images: fileDef.options.images.map((imageDef: any) => {
                      return {
                        ...imageDef,
                        url: handleUrl(imageDef.url, false),
                        ...(imageDef.metadata?.omeTiffOffsetsUrl
                          ? {
                              metadata: {
                                ...imageDef.metadata,
                                omeTiffOffsetsUrl: handleUrl(imageDef.metadata.omeTiffOffsetsUrl, false),
                              },
                            }
                          : {}),
                      };
                    }),
                  },
                }
              : {}),
          };
        }),
      };
    }),
  } as unknown as VitessceConfig;
};

export { fillUrls };
