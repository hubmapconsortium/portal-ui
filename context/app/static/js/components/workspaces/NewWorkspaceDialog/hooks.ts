import { useCallback } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';
import { trackEvent } from 'js/helpers/trackers';
import { SWRError } from 'js/helpers/swr/errors';
import {
  TemplatesResponse,
  CreateTemplateNotebooksTypes,
  TemplateTagsResponse,
  TemplatesTypes,
  TemplateExample,
} from 'js/components/workspaces/types';
import { useCreateAndLaunchWorkspace, useCreateTemplates } from 'js/components/workspaces/hooks';
import { buildDatasetSymlinks } from 'js/components/workspaces/utils';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { useJobTypes } from 'js/components/workspaces/api';
import { DEFAULT_JOB_TYPE } from 'js/components/workspaces/constants';

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
  const { templates } = useWorkspaceTemplates();
  const { toastErrorWorkspaceTemplate } = useWorkspaceToasts();

  const createTemplateNotebooks = useCallback(
    async ({
      workspaceName,
      templateKeys,
      uuids,
      workspaceJobTypeId,
      workspaceResourceOptions,
      onCreateWorkspace,
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
      const symlinks = buildDatasetSymlinks({ datasetUUIDs: uuids });

      onCreateWorkspace?.({
        name: workspaceName,
        files: templatesDetails.map((f) => f.name),
        symlinks: symlinks.map((s) => s.name),
      });

      await createAndLaunchWorkspace({
        templatePath,
        body: {
          name: workspaceName,
          description: workspaceName,
          default_job_type: workspaceJobTypeId,
          workspace_details: {
            globus_groups_token: groupsToken,
            files: templatesDetails,
            symlinks,
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

function useJobTypeName(example: TemplateExample) {
  const { data } = useJobTypes();
  const jobTypeKey = example.job_types?.[0] ?? DEFAULT_JOB_TYPE;

  return data ? Object.values(data).find(({ id }) => id === jobTypeKey)?.name : jobTypeKey;
}

export { useWorkspaceTemplates, useWorkspaceTemplateTags, useTemplateNotebooks, useJobTypeName };
