import useSWRMutation from 'swr/mutation';

import postAndDownloadFile from 'js/helpers/postAndDownloadFile';
import { trackEvent } from 'js/helpers/trackers';
import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

function useMetadataMenu() {
  const { selectedRows: selectedHits } = useSelectableTableStore();
  const { closeMenu } = useDropdownMenuStore();

  return { selectedHits, closeMenu };
}

interface FetchAndDownloadArgs {
  urlPath: string;
  uuids: string[];
  closeMenu: () => void;
  analyticsCategory?: string;
}

async function fetchAndDownload({ urlPath, uuids, closeMenu, analyticsCategory }: FetchAndDownloadArgs) {
  await postAndDownloadFile({ url: urlPath, body: { uuids } });

  if (analyticsCategory) {
    trackEvent({
      category: analyticsCategory,
      action: `Download file`,
      label: urlPath.split('/').pop(),
    });
  }

  closeMenu();
}

interface UseFetchAndDownloadFileArgs {
  lcPluralType: string;
  analyticsCategory?: string;
}

function useFetchAndDownloadFile({ lcPluralType, analyticsCategory }: UseFetchAndDownloadFileArgs) {
  const { closeMenu, selectedHits } = useMetadataMenu();
  // Empty list => download all hits
  const uuids = selectedHits.size > 0 ? [...selectedHits] : [];
  const swr = useSWRMutation(`Download ${selectedHits.size > 0 ? 'selected' : 'all'} ${lcPluralType}`, () =>
    fetchAndDownload({
      urlPath: `/metadata/v0/${lcPluralType}.tsv`,
      uuids,
      closeMenu,
      analyticsCategory,
    }),
  );
  return swr;
}

export { useMetadataMenu, useFetchAndDownloadFile };
