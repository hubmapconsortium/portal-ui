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

/**
 * Adds each selected dataset's root `metadata.json` to the manifest.
 *
 * Distinct from `bulkDownloadMetadata`, which downloads a dataset-level TSV directly from the
 * portal. This one adds a line to the CLT manifest instead, and is only meaningful for file-level
 * selections -- a whole-dataset line already covers everything in the dataset.
 */
const bulkDownloadMetadataJsonField = {
  bulkDownloadMetadataJson: z.boolean().optional(),
};

/**
 * Relaxed variant used when the selection contains individually chosen files.
 *
 * The processing-type options classify whole datasets, so they are neither shown nor required when
 * the user has already named the exact files they want.
 */
const bulkDownloadOptionsOptionalField = {
  bulkDownloadOptions: z.array(z.string()).optional(),
};

export {
  bulkDownloadOptionsField,
  bulkDownloadOptionsOptionalField,
  bulkDownloadMetadataField,
  bulkDownloadMetadataJsonField,
};
