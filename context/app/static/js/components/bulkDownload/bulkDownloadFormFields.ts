import { z } from 'zod';

function withCustomMessage(message: string): z.ZodErrorMap {
  return function tooSmallErrorMap(issue, ctx) {
    if (issue.code === z.ZodIssueCode.too_small) {
      return { message };
    }
    return { message: ctx.defaultError };
  };
}

const bulkDownloadOptionsField = {
  bulkDownloadOptions: z
    .array(z.string(), {
      errorMap: withCustomMessage('At least one template must be selected. Please select a template.'),
    })
    .default([]),
};

const bulkDownloadMetadataField = z.object({
  bulkDownloadMetadata: z.boolean().optional(),
});

export { bulkDownloadOptionsField, bulkDownloadMetadataField };
