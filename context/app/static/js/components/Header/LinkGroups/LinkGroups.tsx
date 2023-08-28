import React, { Fragment } from 'react';
import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';

type LinkType = {
  href: string;
  label: string;
};

type LinkGroupType = Record<string, LinkType[]>;

interface LinksSectionProps {
  isIndented: boolean;
}

type LinkGroupsProps = LinksSectionProps & { groups: LinkGroupType };

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

export type { LinkGroupType, LinksSectionProps };
export default LinkGroups;
