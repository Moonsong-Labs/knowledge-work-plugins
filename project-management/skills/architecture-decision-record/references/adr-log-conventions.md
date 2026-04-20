# ADR Log Conventions

Use this when creating an ADR log, placing a new ADR, or superseding an existing ADR.

## Contents

* [Location Discovery](#location-discovery)
* [Templates](#templates)
* [Filenames](#filenames)
* [Numbering](#numbering)
* [Categories](#categories)
* [Status Lifecycle](#status-lifecycle)
* [Superseding](#superseding)
* [Cross-ADR Links](#cross-adr-links)
* [Validation](#validation)

## Location Discovery

Prefer the repository's existing convention. Check:

* `docs/decisions/`
* `docs/adr/`
* `docs/ADRs/`
* `docs/architecture/decisions/`
* `decisions/`
* Existing README or architecture docs that link to ADRs.

If no convention exists, use `docs/decisions/`.

## Templates

If the project already has an ADR template, use it. Do not replace local templates unless the user asks for a migration.

If no template exists:

* Use `adr-template-minimal.md` for small decisions.
* Use `adr-template.md` for normal or high-impact decisions.
* Keep a copy of the selected template in the ADR directory if the project wants repeatable manual creation.

## Filenames

Prefer:

```text
NNNN-title-with-dashes.md
```

Rules:

* `NNNN` is the next sequential number.
* Match existing padding. If none exists, use four digits.
* Use lowercase words separated by dashes.
* Do not include the number in the H1 unless the local project already does.
* Keep `.md` suffix.

Examples:

```text
0001-use-managed-postgres-for-audit-events.md
0012-adopt-json-schema-for-webhook-contracts.md
```

## Numbering

When ADRs are all in one directory:

* Use the next global number.
* Detect gaps but do not renumber existing ADRs.
* If two files race for the same number, choose the next unused number.

When ADRs are categorized by subdirectory:

* Follow the existing local or global numbering convention.
* If creating categories for the first time, prefer one level of folders with local numbering.
* Do not nest category folders unless the repository already does.

## Categories

Use categories only when the ADR log is large enough that discovery is becoming hard.

Good category choices:

* Follow architecture or product boundaries already present in the repo.
* Keep one folder level.
* Use stable names such as `backend`, `ui`, `data`, `security`, or domain names from the codebase.

Avoid:

* Encoding many tags in filenames.
* Deep folder trees.
* Moving historical ADRs without updating links.
* Creating categories before there is enough volume to justify them.

## Status Lifecycle

Common statuses:

* `proposed`: under discussion.
* `accepted`: agreed and should be followed.
* `rejected`: considered but not adopted.
* `deprecated`: no longer recommended or relevant.
* `superseded by ADR-NNNN`: replaced by a newer decision.

Use the local vocabulary if it exists.

## Superseding

When a new ADR replaces an old one:

1. Write the new ADR as a complete decision.
2. In the old ADR, update status to `superseded by ADR-NNNN`.
3. Add a link from the new ADR back to the old ADR in `More Information`.
4. Add a link from the old ADR to the new ADR if the project convention allows body edits.
5. Do not delete old ADRs unless the project has an explicit retention policy.

## Cross-ADR Links

Use `More Information` for related ADR links unless local tooling requires a relationship table.

Examples:

```markdown
## More Information

This supersedes [ADR-0007](0007-use-local-disk-cache.md).
This depends on [ADR-0011](0011-adopt-managed-postgres.md).
```

## Validation

Before finishing:

* Check that the new number is unique.
* Check that links are relative and valid.
* Check that old superseded ADRs point to the successor.
* Run markdown formatting/linting if the repository has it.
* Do not renumber or rewrite historical ADRs as cleanup unless explicitly requested.
