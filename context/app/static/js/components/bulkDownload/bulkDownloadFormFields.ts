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
  bulkDownloadOptions: z.string({
    errorMap: withCustomMessage('A download option is required. Please select a download option.'),
  }),
};

const bulkDownloadMetadataField = z.object({
  bulkDownloadMetadata: z.boolean().optional(),
});

export { bulkDownloadOptionsField, bulkDownloadMetadataField };
