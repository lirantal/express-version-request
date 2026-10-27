# Release

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and release notes.

## Release Flow

1. Ensure all intended changes are merged and CI is green.
2. Run `yarn run version` to apply Changesets version and changelog updates.
3. Review the generated package and changelog changes.
4. Run the release command, if configured for the repository.

The `release` script runs `changeset publish`. The release workflow runs it after applying any pending Changesets.

This repository uses Yarn Classic. Keep `@changesets/cli` on v2 and the Changesets GitHub action on v1 while using this package manager. Changesets CLI v3 does not support Yarn Classic; upgrading to it requires a package-manager migration.

## Changesets

Add a changeset for user-facing package behavior changes:

```sh
yarn changeset
```

Documentation-only, test-only, and internal refactor PRs usually do not need a changeset unless they describe or accompany a release-worthy behavior change.
