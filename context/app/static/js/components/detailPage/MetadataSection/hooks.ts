import { Donor, Dataset, Sample } from 'js/components/types';
import { useMemo } from 'react';
import { getTableEntities } from './utils';
import { useFlaskDataContext } from 'js/components/Contexts';
import { useMetadataFieldDescriptions } from 'js/hooks/useUBKG';
import { createDownloadUrl, tableToDelimitedString } from 'js/helpers/functions';
import { defaultTSVColumns } from './columns';

export function useMetadataEntityDownloads(entities: (Donor | Dataset | Sample)[], tsvColumns = defaultTSVColumns) {
  const { data: fieldDescriptions } = useMetadataFieldDescriptions();
  const {
    entity: { uuid },
  } = useFlaskDataContext();

  return useMemo(() => {
    const tableEntities = getTableEntities({ entities, uuid, fieldDescriptions });
    const allTableRows = tableEntities.map((d) => d.tableRows).flat();
    const downloadUrl = createDownloadUrl(
      tableToDelimitedString(
        allTableRows,
        tsvColumns.map((col) => col.label),
        '\t',
      ),
      'text/tab-separated-values',
    );
    return {
      tableEntities,
      allTableRows,
      downloadUrl,
    };
  }, [entities, uuid, fieldDescriptions, tsvColumns]);
}
