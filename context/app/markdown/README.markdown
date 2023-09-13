MD documents in this directory will be available at the top level on the site.
For example, `CHANGELOG.md` is available at [`/CHANGELOG`](https://portal.hubmapconsortium.org/CHANGELOG).

- This file is `README.markdown` instead of `README.md` so that it _won't_ be available at `/README`.
- During development, this directory is read at startup; If you add a new file, you will need to restart.
- If a file has the suffix `.redirect`, it will be read, and the server will give a redirect to the path it contains.
