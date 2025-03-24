import { z } from 'zod';
import { withCustomMessage } from 'js/helpers/zod/withCustomMessage';

const workspaceNameField = {
  'workspace-name': z
    .string({ errorMap: withCustomMessage('A workspace name is required. Please enter a workspace name.') })
    .min(1),
};

const workspaceDescriptionField = {
  'workspace-description': z.string(),
};

const protectedDatasetsField = { 'protected-datasets': z.string() };

const templatesField = {
  templates: z
    .array(z.string(), {
      errorMap: withCustomMessage('At least one template must be selected. Please select a template.'),
    })
    .nonempty(),
};

const datasetsField = {
  datasets: z.array(z.string(), {
    errorMap: withCustomMessage('At least one dataset must be selected. Please select a dataset.'),
  }),
};

const workspaceIdField = {
  workspaceId: z.number({
    required_error: 'At least one workspace must be selected. Please select a workspace.',
  }),
};

const workspaceJobTypeIdField = {
  workspaceJobTypeId: z.string({
    errorMap: withCustomMessage('A workspace environment is required. Please select a workspace environment.'),
  }),
};

const workspaceResourceOptionsField = {
  workspaceResourceOptions: z
    .object({
      num_cpus: z.number(),
      memory_mb: z.number(),
      time_limit_minutes: z.number(),
      gpu_enabled: z.boolean(),
    })
    .optional(),
};

export {
  workspaceNameField,
  workspaceDescriptionField,
  protectedDatasetsField,
  templatesField,
  datasetsField,
  workspaceIdField,
  workspaceJobTypeIdField,
  workspaceResourceOptionsField,
};
