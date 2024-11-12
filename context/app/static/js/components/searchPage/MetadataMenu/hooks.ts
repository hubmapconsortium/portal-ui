import useSWRMutation from 'swr/mutation';

import { postAndDownloadFile } from 'js/helpers/download';
import { trackEvent } from 'js/helpers/trackers';
import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { useSnackbarActions } from 'js/shared-styles/snackbars';

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

function fetchAndDownload({ urlPath, uuids, closeMenu, analyticsCategory }: FetchAndDownloadArgs) {
  return postAndDownloadFile({ url: urlPath, body: { uuids } })
    .catch((error) => {
      console.error('Download failed', error);
      throw error;
    })
    .finally(() => {
      if (analyticsCategory) {
        trackEvent({
          category: analyticsCategory,
          action: `Download file`,
          label: urlPath.split('/').pop(),
        });
      }
      closeMenu();
    });
}

interface UseFetchAndDownloadFileArgs {
  lcPluralType: string;
  analyticsCategory?: string;
}

function useFetchAndDownloadFile({ lcPluralType, analyticsCategory }: UseFetchAndDownloadFileArgs) {
  const { closeMenu, selectedHits } = useMetadataMenu();
  const { toastError } = useSnackbarActions();

  // Empty list => download all hits
  const uuids = selectedHits.size > 0 ? [...selectedHits] : [];
  const swr = useSWRMutation(`Download ${selectedHits.size > 0 ? 'selected' : 'all'} ${lcPluralType}`, () => {
    return fetchAndDownload({
      urlPath: `/metadata/v0/${lcPluralType}.tsv`,
      uuids,
      closeMenu,
      analyticsCategory,
    }).catch(() => {
      toastError('File failed to download.');
    });
  });
  return swr;
}

export { useMetadataMenu, useFetchAndDownloadFile };
