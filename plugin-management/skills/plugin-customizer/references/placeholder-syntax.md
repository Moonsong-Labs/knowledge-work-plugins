# Placeholder Syntax

## Format

Placeholders use the `~~` prefix followed by a category name:

```
~~category name
```

- Lowercase
- Spaces allowed
- Used inline in any markdown content

## Examples

| Placeholder | Typical Replacements |
|------------|---------------------|
| ~~project tracker | Linear, Jira, Asana, Shortcut, GitHub Issues |
| ~~chat tool | Slack, Teams, Discord |
| ~~code repository | GitHub, GitLab, Bitbucket |
| ~~ci/cd pipeline | GitHub Actions, CircleCI, Jenkins |
| ~~alerting system | PagerDuty, OpsGenie, Datadog |
| ~~documentation | Notion, Confluence, GitBook |
| ~~design tool | Figma, Sketch, Adobe XD |

## Usage in Content

Write naturally using placeholders:

```markdown
Check ~~project tracker for open issues labeled "bug".
Post a summary in ~~chat tool when the deploy completes.
```

## CONNECTORS.md

Every placeholder MUST be documented in CONNECTORS.md at the plugin root:

```markdown
# Connectors

| Placeholder | Category | Description |
|------------|----------|-------------|
| ~~project tracker | Project Management | Where tasks and tickets live |
```

## Rules

1. Each `~~placeholder` in content MUST have a CONNECTORS.md entry
2. Each CONNECTORS.md entry SHOULD be used in at least one content file
3. Keep category names short and descriptive
4. Use the most generic category name possible
