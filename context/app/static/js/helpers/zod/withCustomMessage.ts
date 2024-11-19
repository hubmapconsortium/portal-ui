import { z } from 'zod';

export function withCustomMessage(message: string): z.ZodErrorMap {
  return function tooSmallErrorMap(issue, ctx) {
    if (issue.code === z.ZodIssueCode.too_small) {
      return { message };
    }
    return { message: ctx.defaultError };
  };
}
