import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import HighEmphasis from 'js/shared-styles/text/HighEmphasis';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';

function WorkspaceEnvironmentDescription({ children }: PropsWithChildren) {
  return (
    <Stack spacing={2}>
      <Typography>
        All workspaces environments have built-in Python support, with the option to include R or pre-installed packages
        as needed. To view the full list of packages, use the <HighEmphasis>help(&apos;modules&apos;)</HighEmphasis>{' '}
        command for Python or <HighEmphasis>install.packages()</HighEmphasis> for R in your workspace.
      </Typography>
      {children}
      <Typography>
        Please note that selecting environments with extra features may result in longer loading times. For environments
        with GPU packages, it is strongly recommended to enable GPU support in the advanced configurations section.
        Since GPU resources are limited, please select this option only if it is essential for your workspace.
      </Typography>
      <Typography>
        If you have questions about these environments and their respective packages or suggestions for improvements,
        please <ContactUsLink />.
      </Typography>
    </Stack>
  );
}

export default WorkspaceEnvironmentDescription;
