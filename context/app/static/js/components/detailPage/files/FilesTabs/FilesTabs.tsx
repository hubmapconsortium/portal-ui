import React, { useState } from 'react';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tabs';
import { UnprocessedFile } from '../types';
import DataProducts from '../DataProducts';
import Files from '../Files';
import { DataProductProvider } from '../DataProducts/DataProductContext';

interface FilesTabsProps {
  files: UnprocessedFile[];
  uuid: string;
  hubmap_id: string;
  track: (info: { action: string; label: string }) => void;
}

function FilesTabs({ files, uuid, hubmap_id, track }: FilesTabsProps) {
  const [openTabIndex, setOpenTabIndex] = useState(0);

  const hasDataProducts = Boolean(files.filter((file) => file.is_data_product).length);
  const fileBrowserIndex = hasDataProducts ? 1 : 0;
  return (
    <DataProductProvider value={uuid}>
      <Tabs
        value={openTabIndex}
        onChange={(_, newValue) => {
          setOpenTabIndex(newValue as number);
          track({
            action: `Change to ${newValue === fileBrowserIndex ? 'File Browser' : 'Data Products'} Tab`,
            label: hubmap_id,
          });
        }}
      >
        {hasDataProducts && <Tab label="Data Products" index={0} />}
        <Tab label="File Browser" index={fileBrowserIndex} />
      </Tabs>
      {hasDataProducts && (
        <TabPanel value={openTabIndex} index={0}>
          <DataProducts files={files} />
        </TabPanel>
      )}
      <TabPanel value={openTabIndex} index={fileBrowserIndex}>
        <Files files={files} />
      </TabPanel>
    </DataProductProvider>
  );
}

export default FilesTabs;
