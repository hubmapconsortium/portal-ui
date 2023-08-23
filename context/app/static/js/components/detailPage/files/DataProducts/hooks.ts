import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import { useDetailContext } from 'js/components/detailPage/DetailContext';
import { UnprocessedFile } from '../types';

type PipelineInfo = {
  origin: string;
  name: string;
};

// Default fallback values in case no pipeline info is available in metadata
const defaultPipeline: PipelineInfo = {
  name: 'pipeline.cwl',
  origin: 'https://github.com/hubmapconsortium/ingest-pipeline.git',
};

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
      acc.origin = dag.origin;
    }
    if ('name' in dag) {
      acc.name = dag.name;
    }
    return acc;
  }, defaultPipeline);
  return pipelineInfo;
}

/**
 * Format a file's relative path into a link to the file on the assets server
 * @param file An unprocessed file object from the flask context
 * @returns A link to the file on the assets server
 */
function useFileLink(file: UnprocessedFile) {
  const { assetsEndpoint } = useAppContext();
  const { uuid } = useDetailContext();
  return `${assetsEndpoint}/${uuid}/${file.rel_path}`;
}

export { usePipelineInfo, useFileLink };
