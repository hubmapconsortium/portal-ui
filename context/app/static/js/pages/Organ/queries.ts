export function mustHaveOrganClause(organTerms: string[]) {
  return {
    bool: {
      must: { terms: { 'origin_samples.mapped_organ.keyword': organTerms } },
    },
  };
}
