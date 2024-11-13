import { z } from 'zod';
import { withCustomMessage } from 'js/helpers/zod/withCustomMessage';

const bulkDownloadOptionsField = {
  bulkDownloadOptions: z
    .array(z.string(), {
      errorMap: withCustomMessage('A download option is required.'),
    })
    .nonempty(),
};

const bulkDownloadMetadataField = {
  bulkDownloadMetadata: z.boolean().optional(),
};

export { bulkDownloadOptionsField, bulkDownloadMetadataField };
