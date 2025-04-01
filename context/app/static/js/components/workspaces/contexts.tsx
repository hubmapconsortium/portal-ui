import React, { createContext, useContext, PropsWithChildren } from 'react';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';

interface WorkspacesEventContextProps {
  currentEventCategory: WorkspacesEventCategories;
  currentWorkspaceItemId?: number;
}

export const WorkspacesEventContext = createContext<WorkspacesEventContextProps | null>(null);

export const useWorkspacesEventContext = () => {
  const context = useContext(WorkspacesEventContext);
  if (!context) {
    throw new Error('Missing WorkspacesEventContextProvider');
  }
  return context;
};

export function WorkspacesEventContextProvider({ children, ...props }: PropsWithChildren<WorkspacesEventContextProps>) {
  return <WorkspacesEventContext.Provider value={props}>{children}</WorkspacesEventContext.Provider>;
}
