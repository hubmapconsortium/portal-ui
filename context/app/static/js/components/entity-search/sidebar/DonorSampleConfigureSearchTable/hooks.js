import { useMetadataFieldConfigs } from 'js/components/entity-search/sidebar/ConfigureSearchTable/hooks';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';

function useDonorSampleMetadatFieldConfigs() {
  const { initialFields, initialFacets } = useStore();
  return useMetadataFieldConfigs({ ...initialFields, ...initialFacets });
}

export { useDonorSampleMetadatFieldConfigs };
