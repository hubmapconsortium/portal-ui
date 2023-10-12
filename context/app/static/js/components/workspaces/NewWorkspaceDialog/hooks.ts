import { useCallback } from 'react';
import useSWR from 'swr';
import type { SWRResponse } from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { fetcher, multiFetcher } from 'js/helpers/swr';
import { startJob } from '../utils';

interface WorkspaceAPIResponse {
  message: string;
  success: true | false;
  data: unknown;
}

interface UserTemplatesTypes {
  templatesURL: string;
  f?: typeof fetcher | typeof multiFetcher;
}

interface TemplateTypes {
  title: string;
  description: string;
  tags: string[];
  is_multi_dataset_template: bool;
  template_format: string;
}

interface TemplatesResponse extends WorkspaceAPIResponse {
  data: Record<string, TemplateTypes>;
}

interface CreateTemplateNotebooksTypes {
  templateKeys: string[];
  uuids: string[];
  workspaceName: string;
}

interface CreateTemplateData {
  template: string;
}

interface CreateTemplatesResponse extends WorkspaceAPIResponse {
  data: CreateTemplateData;
}

interface CreateWorkspaceData {
  workspace: {
    id: number;
  };
}

interface CreateWorkspaceResponse extends WorkspaceAPIResponse {
  data: CreateWorkspaceData;
}

function useUserTemplatesAPI({ templatesURL, f = fetcher }: UserTemplatesTypes) {
  const { groupsToken } = useAppContext();

  const result = useSWR(
    [templatesURL, groupsToken],
    ([url, token]: string[]) =>
      f({
        url,
        requestInit: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }),
    { fallbackData: {} },
  );

  return result;
}

function useWorkspaceTemplates(tags: string[] = []) {
  const { userTemplatesEndpoint } = useAppContext();

  const queryParams = tags.map((tag, i) => `${i === 0 ? '' : '&'}tags=${encodeURIComponent(tag)}`).join('');

  const url = `${userTemplatesEndpoint}/templates/jupyter_lab/?${queryParams}`;
  const result: SWRResponse<TemplatesResponse> = useUserTemplatesAPI({ templatesURL: url });

  const templates = result?.data?.data ?? {};
  return { templates };
}

function useTemplateNotebooks() {
  const { groupsToken, workspacesToken, workspacesEndpoint, userTemplatesEndpoint } = useAppContext();

  const createTemplateNotebooks = useCallback(
    async ({ workspaceName, templateKeys, uuids }: CreateTemplateNotebooksTypes) => {
      const templateUrls = templateKeys.map((key) => `${userTemplatesEndpoint}templates/jupyter_lab/${key}`);
      const createdTemplates = await multiFetcher<CreateTemplatesResponse>({
        templateUrls,
        requestInit: {
          method: 'POST',
          body: JSON.stringify({ uuids }),
          headers: { Authorization: `Bearer ${groupsToken}` },
        },
      });

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

  const result: SWRResponse<TemplatesResponse> = useUserTemplatesAPI({
    templatesURL: `${userTemplatesEndpoint}/tags/`,
  });

  const tags = result?.data?.data ?? {};
  return { tags };
}

export { useWorkspaceTemplates, useWorkspaceTemplateTags, TemplateTypes, useTemplateNotebooks };