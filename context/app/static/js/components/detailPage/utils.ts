export function getSectionOrder(
  possibleSections: string[],
  optionalSectionsToInclude: Record<string, boolean>,
): string[] {
  return possibleSections.filter(
    (section) => !(section in optionalSectionsToInclude) || optionalSectionsToInclude[section],
  );
}

export function getCombinedDatasetStatus({ sub_status, status }: { sub_status: unknown; status: unknown }) {
  return sub_status || status;
}
