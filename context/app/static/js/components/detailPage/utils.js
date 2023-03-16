export function getSectionOrder(possibleSections, optionalSectionsToInclude) {
  return possibleSections.filter(
    (section) => !(section in optionalSectionsToInclude) || optionalSectionsToInclude[section],
  );
}

export function getCombinedDatasetStatus({ sub_status, status }) {
  return sub_status || status;
}
