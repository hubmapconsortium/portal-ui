import { useEffect, useMemo, useState } from 'react';
import { WorkspaceWithUserId } from 'js/components/workspaces/types';
import { TableFilter } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';

function useWorkspacesTable(workspacesList: WorkspaceWithUserId[]) {
  const { ownWorkspaces, sharedWorkspaces } = useMemo(() => {
    const own = workspacesList.filter((workspace) => {
      return !workspace.user_id;
    });
    const shared = workspacesList.filter((workspace) => {
      return !!workspace.user_id;
    });
    return { ownWorkspaces: own, sharedWorkspaces: shared };
  }, [workspacesList]);

  const [showOwn, setShowOwn] = useState(true);
  const [showShared, setShowShared] = useState(true);

  useEffect(() => {
    setShowShared(sharedWorkspaces.length > 0);
  }, [sharedWorkspaces.length]);

  const filteredWorkspaces = useMemo(() => {
    if (showOwn && showShared) {
      return workspacesList;
    }
    if (showOwn) {
      return ownWorkspaces;
    }
    if (showShared) {
      return sharedWorkspaces;
    }
    return [];
  }, [ownWorkspaces, sharedWorkspaces, showOwn, showShared, workspacesList]);

  const filters: TableFilter[] = useMemo(
    () => [
      {
        label: `Created by Me (${ownWorkspaces.length})`,
        setShow: setShowOwn,
        show: showOwn,
        disabled: !ownWorkspaces.length,
      },
      {
        label: `Created by Other (${sharedWorkspaces.length})`,
        setShow: setShowShared,
        show: showShared,
        disabled: !sharedWorkspaces.length,
      },
    ],
    [ownWorkspaces.length, sharedWorkspaces.length, showOwn, showShared],
  );

  return {
    filteredWorkspaces,
    filters,
  };
}

export default useWorkspacesTable;
