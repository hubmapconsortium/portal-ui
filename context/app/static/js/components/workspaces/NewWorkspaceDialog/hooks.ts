import { useCallback } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { fetcher, multiFetcher } from 'js/helpers/swr';
import { startJob } from '../utils';
import {
  TemplatesResponse,
  CreateTemplatesResponse,
  CreateWorkspaceResponse,
  CreateTemplateNotebooksTypes,
  TemplateTagsResponse,
} from '../types';

interface UserTemplatesTypes {
  templatesURL: string;
  config?: Partial<SWRConfiguration>;
}

function useUserTemplatesAPI<T>({ templatesURL, config = { fallbackData: {} } }: UserTemplatesTypes) {
  const { groupsToken } = useAppContext();

  return useSWR<T>(
    [templatesURL, groupsToken],
    ([url, token]: string[]) =>
      fetcher({
        url,
        requestInit: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }),
    { ...config },
  );
}

function useWorkspaceTemplates(tags: string[] = []) {
  const { userTemplatesEndpoint } = useAppContext();

  const queryParams = tags.map((tag, i) => `${i === 0 ? '' : '&'}tags=${encodeURIComponent(tag)}`).join('');

  const url = `${userTemplatesEndpoint}/templates/jupyter_lab/?${queryParams}`;
  const result = useUserTemplatesAPI<TemplatesResponse>({ templatesURL: url });

  const templates = result?.data?.data ?? {};
  return { templates };
}

function useTemplateNotebooks() {
  const { groupsToken, workspacesToken, workspacesEndpoint, userTemplatesEndpoint } = useAppContext();

  const createTemplateNotebooks = useCallback(
    async ({ workspaceName, templateKeys, uuids }: CreateTemplateNotebooksTypes) => {
      const templateUrls = templateKeys.map((key) => `${userTemplatesEndpoint}/templates/jupyter_lab/${key}`);
      const createdTemplates = await multiFetcher<CreateTemplatesResponse>({
        urls: templateUrls,
        requestInit: {
          method: 'POST',
          body: JSON.stringify({ uuids }),
          headers: { Authorization: `Bearer ${groupsToken}` },
        },
      });

      if (createdTemplates.some((t) => !t.success)) {
        // TODO: Log error and display toast.
        return;
      }

      const workspace = await fetcher<CreateWorkspaceResponse>({
        url: `${workspacesEndpoint}/workspaces/`,
        requestInit: {
          method: 'POST',
          body: JSON.stringify({
            name: workspaceName,
            description: workspaceName,
            workspace_details: {
              globus_groups_token: groupsToken,
              files: templateKeys.map((templateKey, i) => ({
                name: `${templateKey}.ipynb`,
                content: createdTemplates[i]?.data?.template,
              })),
              symlinks: uuids.map((uuid) => ({
                name: `datasets/${uuid}`,
                dataset_uuid: uuid,
              })),
            },
          }),
          headers: { 'UWS-Authorization': `Token ${workspacesToken}` },
        },
      });
      const workspaceId = workspace?.data?.workspace?.id;

      if (workspaceId) {
        await startJob({ workspaceId, workspacesEndpoint, workspacesToken });
        window.open(
          `/workspaces/${workspaceId}?notebook_path=${encodeURIComponent(`${templateKeys[0]}.ipynb`)}`,
          '_blank',
        );
      }
    },
    [groupsToken, workspacesToken, workspacesEndpoint, userTemplatesEndpoint],
  );

  return createTemplateNotebooks;
}

function useWorkspaceTemplateTags() {
  const { userTemplatesEndpoint } = useAppContext();

  const result = useUserTemplatesAPI<TemplateTagsResponse>({
    templatesURL: `${userTemplatesEndpoint}/tags/`,
  });

  const tags = result?.data?.data ?? {};
  return { tags };
}

export { useWorkspaceTemplates, useWorkspaceTemplateTags, useTemplateNotebooks };
