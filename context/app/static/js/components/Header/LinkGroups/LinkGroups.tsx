import React, { Fragment } from 'react';
import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';

interface LinksSectionProps {
  isIndented: boolean;
}

interface LinkType {
  href: string;
  label: string;
}

interface LinkGroupType {
  [key: string]: LinkType[];
}

interface LinkGroupsProps extends LinksSectionProps {
  groups: LinkGroupType;
}

function LinkGroups({ groups, isIndented }: LinkGroupsProps) {
  return Object.entries(groups).map(([k, group], i) => (
    <Fragment key={k}>
      {i !== 0 && <StyledDivider />}
      {group.map(({ href, label }) => (
        <DropdownLink href={href} isIndented={isIndented} key={href}>
          {label}
        </DropdownLink>
      ))}
    </Fragment>
  ));
}

export type { LinksSectionProps };
export default LinkGroups;
