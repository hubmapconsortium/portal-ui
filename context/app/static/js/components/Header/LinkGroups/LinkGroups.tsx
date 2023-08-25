import React from 'react';
import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';

interface LinksSectionProps {
  isIndented: boolean;
}

interface LinkType {
  href: string;
  label: string;
}

interface LinkGroupsProps extends LinksSectionProps {
  groups: LinkType[][];
}

function LinkGroups({ groups, isIndented }: LinkGroupsProps) {
  return groups.map((group, i) => (
    <>
      {i !== 0 && <StyledDivider />}
      {group.map(({ href, label }) => (
        <DropdownLink href={href} isIndented={isIndented} key={href}>
          {label}
        </DropdownLink>
      ))}
    </>
  ));
}

export type { LinksSectionProps };
export default LinkGroups;
