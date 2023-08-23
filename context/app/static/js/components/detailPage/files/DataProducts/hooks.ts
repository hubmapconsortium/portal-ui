import { useFlaskDataContext } from 'js/components/Contexts';

type PipelineInfo = {
  origin: string;
  name: string;
};

// Default fallback values in case no pipeline info is available
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

export { usePipelineInfo };
