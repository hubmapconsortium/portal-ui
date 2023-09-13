import React, { Fragment } from 'react';
import DropdownLink from '../DropdownLink';

interface LinkType {
  href: string;
  label: string;
}

type LinkGroupType = Record<string, LinkType[]>;

interface LinksSectionProps {
  isIndented: boolean;
}

type LinkGroupsProps = LinksSectionProps & { groups: LinkGroupType };

function LinkGroups({ groups, isIndented }: LinkGroupsProps) {
  return Object.entries(groups).map(([k, group], groupsIndex) => (
    <Fragment key={k}>
      {group.map(({ href, label }, groupIndex) => (
        <DropdownLink
          href={href}
          isIndented={isIndented}
          key={href}
          // Display a divider after the last link in each group, but not after the last group.
          divider={groupIndex === group.length - 1 && groupsIndex !== Object.keys(groups).length - 1}
        >
          {label}
        </DropdownLink>
      ))}
    </Fragment>
  ));
}

export type { LinkGroupType, LinksSectionProps };
export default LinkGroups;
