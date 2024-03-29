/**
 * @param {object} config The "template" config containing URLs with "{{ base_url }}".
 * @param {function} handleUrl Function that takes in a (potentially template) URL string and returns a filled-in URL string.
 * @returns {object} The config with handleUrl having been called to process every URL.
 */
const fillUrls = (config, handleUrl, handleRequestInit) => {
  return {
    ...config,
    datasets: config.datasets.map((datasetDef) => {
      return {
        ...datasetDef,
        files: datasetDef.files.map((fileDef) => {
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
                    images: fileDef.options.images.map((imageDef) => {
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
  };
};

export { fillUrls };
