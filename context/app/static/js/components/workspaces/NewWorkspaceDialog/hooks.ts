import { useCallback } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';
import { trackEvent } from 'js/helpers/trackers';
import { SWRError } from 'js/helpers/swr/errors';
import { TemplatesResponse, CreateTemplateNotebooksTypes, TemplateTagsResponse } from 'js/components/workspaces/types';
import { useCreateAndLaunchWorkspace, useCreateTemplates } from 'js/components/workspaces/hooks';
import { buildDatasetSymlinks } from 'js/components/workspaces/utils';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { R_JOB_TYPE, R_TEMPLATE_TAG } from 'js/components/workspaces/constants';

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

  const url = `${userTemplatesEndpoint}/templates/jupyter_lab`;
  const result = useUserTemplatesAPI<TemplatesResponse>({ templatesURL: url });

  const templates = result?.data?.data ?? {};

  // Manually update tags and title for R templates
  const updatedTemplates = Object.fromEntries(
    Object.entries(templates).map(([key, template]) => {
      const isRTemplate = template.job_types?.includes(R_JOB_TYPE);

      const updatedTitle = isRTemplate ? `${template.title} (${R_TEMPLATE_TAG})` : template.title;
      const updatedTags = [...template.tags, ...(isRTemplate ? [R_TEMPLATE_TAG] : [])];

      return [key, { ...template, tags: updatedTags, title: updatedTitle }];
    }),
  );

  // Filter templates by tags
  const filteredTemplates = Object.fromEntries(
    Object.entries(updatedTemplates).filter(([_, template]) => tags.every((tag) => template.tags?.includes(tag))),
  );

  return {
    templates: filteredTemplates,
  };
}

function useTemplateNotebooks() {
  const { groupsToken } = useAppContext();

  const { createAndLaunchWorkspace } = useCreateAndLaunchWorkspace();
  const { createTemplates } = useCreateTemplates();
  const { templates } = useWorkspaceTemplates();
  const { toastErrorWorkspaceTemplate } = useWorkspaceToasts();

  const createTemplateNotebooks = useCallback(
    async ({
      workspaceName,
      templateKeys,
      uuids,
      workspaceJobTypeId,
      workspaceResourceOptions,
    }: CreateTemplateNotebooksTypes) => {
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
            toastErrorWorkspaceTemplate(templates?.[templateKey].title);
            return;
          }
        }
        toastErrorWorkspaceTemplate();
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
        resourceOptions: workspaceResourceOptions,
      });
    },
    [groupsToken, createAndLaunchWorkspace, createTemplates, toastErrorWorkspaceTemplate, templates],
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
