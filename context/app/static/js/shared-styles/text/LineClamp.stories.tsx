import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import LineClamp, { LineClampProps } from './LineClamp';

type Story = StoryObj<LineClampProps>;

function Template(args: LineClampProps) {
  return (
    <LineClamp {...args}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Posuere sollicitudin aliquam ultrices sagittis orci a scelerisque purus. Eget mauris pharetra et
      ultrices. Gravida arcu ac tortor dignissim convallis aenean et. Pulvinar etiam non quam lacus suspendisse. Eget
      est lorem ipsum dolor sit. Semper viverra nam libero justo laoreet sit amet. Interdum posuere lorem ipsum dolor
      sit amet consectetur. Feugiat pretium nibh ipsum consequat nisl vel pretium. Tempus urna et pharetra pharetra
      massa massa ultricies mi quis. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Arcu
      non odio euismod lacinia at quis risus sed. Et tortor at risus viverra. Mauris rhoncus aenean vel elit scelerisque
      mauris pellentesque. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus. Vestibulum mattis
      ullamcorper velit sed ullamcorper morbi tincidunt. Vulputate enim nulla aliquet porttitor lacus luctus accumsan.
      Pulvinar etiam non quam lacus suspendisse. Gravida rutrum quisque non tellus orci ac. Sit amet cursus sit amet
      dictum sit amet justo. Vitae purus faucibus ornare suspendisse sed nisi lacus sed. Est ante in nibh mauris cursus
      mattis. Vitae semper quis lectus nulla at volutpat. Dictum fusce ut placerat orci. Lacus laoreet non curabitur
      gravida arcu ac tortor dignissim convallis. Fermentum et sollicitudin ac orci phasellus egestas. Ac turpis egestas
      maecenas pharetra convallis posuere morbi leo urna. Commodo quis imperdiet massa tincidunt nunc pulvinar. Massa
      sapien faucibus et molestie ac. Id leo in vitae turpis massa sed elementum tempus. Ut venenatis tellus in metus.
      Aliquet nec ullamcorper sit amet risus nullam. Est sit amet facilisis magna etiam tempor orci eu lobortis.
      Malesuada fames ac turpis egestas maecenas pharetra. Nec ullamcorper sit amet risus nullam eget felis. Id donec
      ultrices tincidunt arcu non sodales. Consectetur lorem donec massa sapien faucibus. Amet risus nullam eget felis
      eget nunc lobortis mattis. Sapien eget mi proin sed. Phasellus vestibulum lorem sed risus ultricies tristique
      nulla. Vulputate sapien nec sagittis aliquam malesuada. Quis lectus nulla at volutpat diam ut venenatis tellus.
      Lacinia at quis risus sed vulputate odio. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Interdum
      velit laoreet id donec ultrices tincidunt. Amet consectetur adipiscing elit pellentesque. Enim nec dui nunc mattis
      enim ut tellus elementum sagittis. Mauris a diam maecenas sed enim ut. Sem et tortor consequat id porta nibh
      venenatis. Cursus turpis massa tincidunt dui. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies.
      Velit aliquet sagittis id consectetur purus ut faucibus. Vitae aliquet nec ullamcorper sit. Purus semper eget duis
      at tellus at. Sem et tortor consequat id porta nibh venenatis cras sed. Vestibulum morbi blandit cursus risus at
      ultrices mi tempus. Fringilla ut morbi tincidunt augue interdum velit euismod. Diam in arcu cursus euismod quis
      viverra nibh cras pulvinar. Morbi non arcu risus quis varius quam. Nunc congue nisi vitae suscipit tellus. Nisl
      condimentum id venenatis a. Elit sed vulputate mi sit amet. Sit amet dictum sit amet justo donec enim diam.
      Aliquet nec ullamcorper sit amet. Volutpat blandit aliquam etiam erat velit. Tincidunt eget nullam non nisi est
      sit amet facilisis. Non quam lacus suspendisse faucibus. Semper eget duis at tellus at urna condimentum.
    </LineClamp>
  );
}

export default {
  title: 'Text/LineClamp',
  component: Template,
} satisfies Meta<LineClampProps>;

export const OneLine: Story = {
  args: {
    lines: 1,
  },
};

export const ThreeLines: Story = {
  args: {
    lines: 3,
  },
};
