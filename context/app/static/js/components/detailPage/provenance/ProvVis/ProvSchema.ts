import { z } from 'zod';

// Provenance JSON Schema converted to zod schema
// Original schema came from https://github.com/hubmapconsortium-graveyard/prov-vis

const stringToAnything = z.string().or(z.boolean()).or(z.number()).or(z.object({}).passthrough());
const stringToStringToAnything = z.record(stringToAnything);

export const provSchema = z
  .object({
    prefix: stringToAnything,
    entity: stringToStringToAnything,
    activity: stringToStringToAnything,
    wasGeneratedBy: stringToStringToAnything,
    wasStartedBy: stringToStringToAnything.optional(),
    wasAssociatedWith: stringToStringToAnything.optional(),
    mentionOf: stringToStringToAnything.optional(),
    hadMember: stringToStringToAnything.optional(),
    wasEndedBy: stringToStringToAnything.optional(),
    specializationOf: stringToStringToAnything.optional(),
    used: stringToStringToAnything,
    agent: stringToStringToAnything.optional(),
    bundle: stringToStringToAnything.optional(),
    actedOnBehalfOf: stringToStringToAnything.optional(),
  })
  .strict();

export type ProvSchema = z.infer<typeof provSchema>;
