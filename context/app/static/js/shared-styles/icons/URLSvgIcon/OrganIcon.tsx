import React from 'react';
import URLSvgIcon, { URLSvgIconProps } from './URLSvgIcon';

export function OrganIcon(props: Omit<URLSvgIconProps, 'iconURL'>) {
  return (
    <URLSvgIcon
      {...props}
      iconURL="https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-kidney.svg"
    />
  );
}
