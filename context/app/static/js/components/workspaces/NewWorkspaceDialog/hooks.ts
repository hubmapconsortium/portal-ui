import { useCallback } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';
import { trackEvent } from 'js/helpers/trackers';
import { TemplatesResponse, CreateTemplateNotebooksTypes, TemplateTagsResponse, TemplatesTypes } from '../types';
import { useCreateAndLaunchWorkspace, useCreateTemplates } from '../hooks';

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

  const filteredTemplates = Object.fromEntries(
    Object.entries(templates).filter(([, template]) => !template?.is_hidden),
  ) as TemplatesTypes;

  return {
    templates: filteredTemplates,
  };
}

function useTemplateNotebooks() {
  const { groupsToken } = useAppContext();

  const { createAndLaunchWorkspace } = useCreateAndLaunchWorkspace();
  const { createTemplates } = useCreateTemplates();

  const createTemplateNotebooks = useCallback(
    async ({ workspaceName, templateKeys, uuids }: CreateTemplateNotebooksTypes) => {
      const templatesDetails = await createTemplates({ templateKeys, uuids });
      trackEvent({
        category: 'Workspace Action',
        action: 'Create Templates',
        label: { templateKeys, templateCount: templateKeys.length, uuids },
      });

      const templatePath = templatesDetails[0].name;

      await createAndLaunchWorkspace({
        templatePath,
        body: {
          name: workspaceName,
          description: workspaceName,
          workspace_details: {
            globus_groups_token: groupsToken,
            files: templatesDetails,
            symlinks: uuids.map((uuid) => ({
              name: `datasets/${uuid}`,
              dataset_uuid: uuid,
            })),
          },
        },
      });
    },
    [groupsToken, createAndLaunchWorkspace, createTemplates],
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
