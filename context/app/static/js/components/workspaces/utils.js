async function createNotebookWorkspace({
  workspacesEndpoint,
  workspacesToken,
  workspaceName,
  workspaceDescription,
  notebookContent,
}) {
  await fetch(`${workspacesEndpoint}/workspaces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'UWS-Authorization': `Token ${workspacesToken}`,
    },
    body: JSON.stringify({
      name: workspaceName,
      description: workspaceDescription,
      workspace_details: {
        symlinks: [],
        files: [
          {
            name: 'notebook.ipynb',
            content: notebookContent,
          },
        ],
      },
    }),
  });
}

async function startJob({ workspaceId, workspacesEndpoint, workspacesToken }) {
  await fetch(`${workspacesEndpoint}/workspaces/${workspaceId}/start`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'UWS-Authorization': `Token ${workspacesToken}`,
    },
    body: JSON.stringify({
      job_type: 'JupyterLabJob',
      job_details: {},
    }),
  });
}

export { createNotebookWorkspace, startJob };
