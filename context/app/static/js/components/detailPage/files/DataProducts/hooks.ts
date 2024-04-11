import { useMemo } from 'react';

import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import { useDetailContext } from 'js/components/detailPage/DetailContext';
import { getTokenParam } from 'js/helpers/functions';
import { UnprocessedFile } from '../types';

interface PipelineInfo {
  origin: string;
  name: string;
}

// Default fallback values in case no pipeline info is available in metadata
const defaultPipeline: PipelineInfo = {
  name: 'pipeline.cwl',
  origin: 'https://github.com/hubmapconsortium/ingest-pipeline.git',
};

// Values that should not be displayed as pipeline info
const originDenylist = ['https://github.com/hubmapconsortium/portal-containers'];

// Undescriptive pipeline names which should be replaced with GitHub repo names
const nameDenylist = ['pipeline.cwl'];

function getGithubRepoName(origin: string) {
  const match = origin.match(/github.com\/([^/]+)\/([^/]+)(\/|$)/);
  if (match) {
    return match[2];
  }
  return origin;
}

/**
 * Extract the latest origin and name from the entity data in the flask context
 * @returns {Object} { origin (pipeline URL), name (pipeline name, if specified)}
 */
function usePipelineInfo(): PipelineInfo {
  const { entity } = useFlaskDataContext();
  const dagList = entity.metadata.dag_provenance_list ?? [];
  // Iterate over the list of DAGs and extract the latest origin and name
  const pipelineInfo = dagList.reduce<PipelineInfo>((acc, dag) => {
    if ('origin' in dag) {
      if (originDenylist.includes(dag.origin)) {
        return acc;
      }
      acc.origin = dag.origin;
    }
    if ('name' in dag) {
      if (nameDenylist.includes(dag.name)) {
        acc.name = getGithubRepoName(acc.origin);
      } else {
        acc.name = dag.name;
      }
    }
    return acc;
  }, defaultPipeline);
  return pipelineInfo;
}

/**
 * Concatenates the parameters of a file download URL together
 * @param assetsEndpoint Assets server URL
 * @param uuid Dataset UUID
 * @param relPath File name
 * @param token Globus groups token parameter
 * @returns Formatted URL
 */
function formatFileLink(assetsEndpoint: string, uuid: string, relPath: string, token?: string) {
  return `${assetsEndpoint}/${uuid}/${relPath}${token ?? ''}`;
}

/**
 * Fetches the assets server URL, dataset UUID, and globus groups token parameters
 * @returns {Object} { assetsEndpoint, uuid, token }
 */
function useFileLinkParameters() {
  const { assetsEndpoint, groupsToken } = useAppContext();
  const token = getTokenParam(groupsToken);
  const { uuid } = useDetailContext();
  return { assetsEndpoint, uuid, token };
}

/**
 * Format a list of files into a list of links to the files on the assets server
 * @param files
 * @returns A list of links to the files on the assets server
 */
function useFileLinks(files: UnprocessedFile[]) {
  const { assetsEndpoint, uuid, token } = useFileLinkParameters();

  const fileLinks = useMemo(
    () => files.map((file) => formatFileLink(assetsEndpoint, uuid, file.rel_path, token)),
    [assetsEndpoint, files, token, uuid],
  );

  return fileLinks;
}

/**
 * Helper function for formatting single file link
 * @param file An unprocessed file object from the flask context
 * @returns A link to the file on the assets server
 */
function useFileLink(file: UnprocessedFile) {
  return useFileLinks([file])[0];
}

export { usePipelineInfo, useFileLink, useFileLinks };
