import { z } from 'zod';

function withCustomMessage(message: string): z.ZodErrorMap {
  return function tooSmallErrorMap(issue, ctx) {
    if (issue.code === z.ZodIssueCode.too_small) {
      return { message };
    }
    return { message: ctx.defaultError };
  };
}

const workspaceNameField = {
  'workspace-name': z
    .string({ errorMap: withCustomMessage('A workspace name is required. Please enter a workspace name.') })
    .min(1)
    .max(150),
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
  protectedDatasetsField,
  templatesField,
  datasetsField,
  workspaceIdField,
  workspaceJobTypeIdField,
  workspaceResourceOptionsField,
};
