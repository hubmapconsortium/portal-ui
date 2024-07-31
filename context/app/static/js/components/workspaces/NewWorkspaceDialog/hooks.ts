import { useCallback } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';
import { trackEvent } from 'js/helpers/trackers';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { SWRError } from 'js/helpers/swr/errors';
import { TemplatesResponse, CreateTemplateNotebooksTypes, TemplateTagsResponse, TemplatesTypes } from '../types';
import { useCreateAndLaunchWorkspace, useCreateTemplates } from '../hooks';
import { buildDatasetSymlinks } from '../utils';
import { DEFAULT_TEMPLATE_KEY } from '../constants';

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

  // Filter out hidden templates and sort alphabetically by title with default template first
  const filteredSortedTemplates = Object.fromEntries(
    Object.entries(templates)
      .filter(([, template]) => !template?.is_hidden)
      .sort(([, a], [, b]) => a.title.localeCompare(b.title))
      .sort(([a], [b]) => {
        if (a === DEFAULT_TEMPLATE_KEY || b === DEFAULT_TEMPLATE_KEY) {
          return a === DEFAULT_TEMPLATE_KEY ? -1 : 1;
        }
        return 0;
      }),
  ) as TemplatesTypes;

  return {
    templates: filteredSortedTemplates,
  };
}

function useTemplateNotebooks() {
  const { groupsToken } = useAppContext();

  const { createAndLaunchWorkspace } = useCreateAndLaunchWorkspace();
  const { createTemplates } = useCreateTemplates();

  const { toastError } = useSnackbarActions();

  const { templates } = useWorkspaceTemplates();

  const createTemplateNotebooks = useCallback(
    async ({ workspaceName, templateKeys, uuids, workspaceJobTypeId }: CreateTemplateNotebooksTypes) => {
      let templatesDetails: {
        name: string;
        content: string | undefined;
      }[] = [];

      try {
        templatesDetails = await createTemplates({ templateKeys, uuids });
        trackEvent({
          category: 'Workspaces',
          action: 'Create Templates',
          label: { templateKeys, templateCount: templateKeys.length, uuids },
        });
      } catch (e) {
        if (e instanceof SWRError) {
          const { url } = e;
          const templateKey = url.split('/').pop();

          if (templateKey && templates?.[templateKey]) {
            toastError(`There are issues with creating ${templates?.[templateKey].title}. Failed to create workspace.`);
            return;
          }
        }
        toastError(`There are issues with creating the selected templates. Failed to create workspace.`);
        return;
      }

      const templatePath = templatesDetails[0].name;

      await createAndLaunchWorkspace({
        templatePath,
        body: {
          name: workspaceName,
          description: workspaceName,
          default_job_type: workspaceJobTypeId,
          workspace_details: {
            globus_groups_token: groupsToken,
            files: templatesDetails,
            symlinks: buildDatasetSymlinks({ datasetUUIDs: uuids }),
          },
        },
      });
    },
    [groupsToken, createAndLaunchWorkspace, createTemplates, toastError, templates],
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
