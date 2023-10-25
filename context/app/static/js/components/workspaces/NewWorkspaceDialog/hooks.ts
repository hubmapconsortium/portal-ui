import { useCallback } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { fetcher, multiFetcher } from 'js/helpers/swr';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import {
  TemplatesResponse,
  CreateTemplatesResponse,
  CreateTemplateNotebooksTypes,
  TemplateTagsResponse,
} from '../types';
import { useCreateAndLaunchWorkspace } from '../api';

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
  const { groupsToken, userTemplatesEndpoint } = useAppContext();

  const { createAndLaunchWorkspace } = useCreateAndLaunchWorkspace();

  const { toastError } = useSnackbarActions();

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
        const error = createdTemplates.reduce((acc, t) => acc.concat(t.message), '');
        toastError(error);
        return;
      }

      const templatePath = `${templateKeys[0]}.ipynb`;

      await createAndLaunchWorkspace({
        templatePath,
        body: {
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
        },
      });
    },
    [groupsToken, createAndLaunchWorkspace, userTemplatesEndpoint, toastError],
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
