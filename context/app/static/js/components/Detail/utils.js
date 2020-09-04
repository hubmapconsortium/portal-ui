export function getSectionOrder(possibleSections, optionalSectionsToInclude) {
  return possibleSections.filter(
    (section) => !(section in optionalSectionsToInclude) || optionalSectionsToInclude[section],
  );
}
