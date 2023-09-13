There isn't a good mechanism in npm to distinguish test-only dependencies from those necessary for the build.

- Cypress is pretty big, so to speed up the build, Cypress and its tests will be in this separate directory.
- Artillery is not large, but it also is not needed for the build, so it's here, too.

## WSL2-specific Cypress setup steps

Some additional steps are necessary in order to run GUI applications (such as Cypress) for anyone using WSL2.

1. Verify you are running WSL2 by opening `cmd.exe` and running `wsl -l -v`; you should have version 2. If you are currently running version 1, it needs to be updated.
2. Install a Windows X server such as [VcXsrv](https://sourceforge.net/projects/vcxsrv/); this can be done in the background while we edit the configuration in the next two steps.
3. Open your `.bashrc` or `.zshrc` file and add the following lines to the top:
   1. `export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0` (to properly set the display server's URL)
   2. `sudo /etc/init.d/dbus start &> /dev/null` (to autostart dbus on startup)
4. Edit the sudoers file for dbus to avoid being prompted for a sudo password each time you open WSL/a new terminal window:
   1. Confirm your username with `whoami` if you're not sure what it is set to.
   2. Use `sudo visudo -f /etc/sudoers.d/dbus`; this will open a blank file in nano.
   3. Add the following line: `<your_username> ALL = (root) NOPASSWD: /etc/init.d/dbus`, replacing `<your_username>` with your actual username and omitting the angle brackets.
   4. Save and exit nano with `Ctrl + O`, `Enter`, `Ctrl + X`.
5. Launch the X server (if using VcXsrv, look for XLaunch). Client/startup settings can be left default, but under Extra settings make sure to check the "Disable access control" checkbox. Allow public AND private networks when Windows prompts for permissions on first launch.
6. Make sure you've used `source ~/.bashrc` to add the DISPLAY environment variable to your shell's environment or have launched another terminal since adding those lines.
7. Launch Cypress by running `npm run cypress` in this directory.
