import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Providers from 'js/components/Providers';
import Header from './Header';

interface HeaderStoryComponent {
  isAuthenticated: boolean;
  userEmail: string;
  groupsToken: string;
  workspacesToken: string;
  isWorkspacesUser: boolean;
  isHubmapUser: boolean;
}

function HeaderStoryComponent(props: HeaderStoryComponent) {
  return (
    <Providers flaskData={{}} endpoints={{ assetsEndpoint: 'https://assets.hubmapconsortium.org' }} {...props}>
      <Header />
    </Providers>
  );
}

const meta: Meta = {
  title: 'Header/Header',
  component: HeaderStoryComponent,
};

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    isAuthenticated: false,
    userEmail: 'undefined',
    groupsToken: '',
    workspacesToken: '',
  },
};

export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
    userEmail: 'asdf@test.com',
    groupsToken: 'asdf',
    workspacesToken: 'asdf',
  },
};

export default meta;
