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
  WorkspacesEventCategories,
} from 'js/components/workspaces/types';
import { useCreateAndLaunchWorkspace, useCreateTemplates, useRunningWorkspaces } from 'js/components/workspaces/hooks';
import { buildDatasetSymlinks, findRunningWorkspaceByJobType } from 'js/components/workspaces/utils';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { useJobTypes } from 'js/components/workspaces/api';
import {
  DEFAULT_JOB_TYPE,
  JUPYTER_LAB_R_JOB_TYPE,
  R_TEMPLATE_TITLE,
  YAC_JOB_TYPE,
} from 'js/components/workspaces/constants';

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
    Object.entries(templates)
      .filter(([, template]) => !template?.is_hidden)
      .map(([key, template]) => {
        const newTitle = template?.job_types?.includes(JUPYTER_LAB_R_JOB_TYPE)
          ? `${template.title} (${R_TEMPLATE_TITLE})`
          : template.title;
        return [key, { ...template, title: newTitle }];
      }),
  ) as TemplatesTypes;

  return {
    templates: filteredTemplates,
  };
}

function useTemplateNotebooks() {
  const { groupsToken } = useAppContext();

  const { createAndLaunchWorkspace, createWorkspaceOnly } = useCreateAndLaunchWorkspace();
  const { createTemplates } = useCreateTemplates();
  const { templates } = useWorkspaceTemplates();
  const { toastErrorWorkspaceTemplate } = useWorkspaceToasts();
  const runningWorkspaces = useRunningWorkspaces();

  const createTemplateNotebooks = useCallback(
    async ({
      templateKeys,
      uuids,
      workspaceName,
      workspaceDescription,
      workspaceJobTypeId,
      workspaceResourceOptions,
      trackingInfo,
    }: CreateTemplateNotebooksTypes) => {
      let templatesDetails: {
        name: string;
        content: string | undefined;
      }[] = [];

      try {
        templatesDetails = await createTemplates({ templateKeys, uuids });
        trackEvent({
          category: WorkspacesEventCategories.Workspaces,
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

      if (trackingInfo) {
        trackEvent({
          ...trackingInfo,
          action: 'Create Workspace',
          label: {
            name: workspaceName,
            files: templatesDetails.map((f) => f.name),
            symlinks: symlinks.map((s) => s.name),
          },
        });
      }

      const workspaceBody = {
        name: workspaceName,
        description: workspaceDescription,
        default_job_type: workspaceJobTypeId,
        workspace_details: {
          globus_groups_token: groupsToken,
          files: templatesDetails,
          symlinks,
        },
      };

      // Check if we're creating a YAC workspace and there's already a running YAC workspace
      if (workspaceJobTypeId === YAC_JOB_TYPE) {
        const runningYACWorkspace = findRunningWorkspaceByJobType(runningWorkspaces, YAC_JOB_TYPE);
        if (runningYACWorkspace) {
          // Create the workspace but don't launch it - use toast without launch message
          const workspace = await createWorkspaceOnly({ body: workspaceBody, showLaunchMessage: false });
          // Return conflict information with the newly created workspace
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          return Promise.reject({
            isYACConflict: true,
            runningWorkspace: runningYACWorkspace,
            newWorkspace: workspace,
            templatePath,
            resourceOptions: workspaceResourceOptions,
            message: `Workspace "${workspaceName}" created, but cannot launch while "${runningYACWorkspace.name}" is running.`,
          });
        }
      }

      await createAndLaunchWorkspace({
        templatePath,
        body: workspaceBody,
        resourceOptions: workspaceResourceOptions,
      });
    },
    [
      groupsToken,
      createAndLaunchWorkspace,
      createWorkspaceOnly,
      createTemplates,
      toastErrorWorkspaceTemplate,
      templates,
      runningWorkspaces,
    ],
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

function useJobTypeName(jobTypeKey: string = DEFAULT_JOB_TYPE) {
  const { data } = useJobTypes();
  return data ? Object.values(data).find(({ id }) => id === jobTypeKey)?.name : jobTypeKey;
}

export { useWorkspaceTemplates, useWorkspaceTemplateTags, useTemplateNotebooks, useJobTypeName };
