**Status: archival.** This directory is retained for historical reference only.
The scripts here are no longer maintained and have not been verified against the
current dependency layout (notably, `artillery.sh` hard-codes a flat
`../node_modules/.bin/artillery` path that predates the pnpm workspace).

A small suite of load tests hardcoded to run against the stage environment.
`artillery.sh` wraps calls to artillery, and summarizes the output.
You will be prompted to set `GROUPS_TOKEN` as an envvar.

- Tests to be run are under [`scenarios/`](scenarios/).
- Tests that _could be_ run are under [`skip-scenarios/`](skip-scenarios/).
