# Example Plugins

## Minimal: Single Skill Plugin

```
my-linting-rules/
├── .claude-plugin/
│   └── plugin.json
├── .cursor-plugin/
│   └── plugin.json
├── .codex/
│   └── INSTALL.md
├── .opencode/
│   └── package.json
├── skills/
│   └── lint-check/
│       └── SKILL.md
└── README.md
```

plugin.json:
```json
{
  "name": "my-linting-rules",
  "description": "Enforces team linting conventions",
  "version": "0.1.0",
  "author": { "name": "Your Team" }
}
```

## Standard: Multi-Component Plugin

```
team-workflows/
├── .claude-plugin/
│   └── plugin.json
├── .cursor-plugin/
│   └── plugin.json
├── .codex/
│   └── INSTALL.md
├── .opencode/
│   └── package.json
├── skills/
│   ├── sprint-planning/
│   │   └── SKILL.md
│   └── incident-response/
│       └── SKILL.md
├── agents/
│   └── sprint-reviewer.md
├── commands/
│   └── plan-sprint.md
└── README.md
```

## Full-Featured: Distributable Plugin with Connectors

```
engineering-ops/
├── .claude-plugin/
│   └── plugin.json
├── .cursor-plugin/
│   └── plugin.json
├── .codex/
│   └── INSTALL.md
├── .opencode/
│   └── package.json
├── skills/
│   ├── triage-issues/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── severity-guide.md
│   └── deploy-checklist/
│       └── SKILL.md
├── agents/
│   └── ops-reviewer.md
├── commands/
│   └── triage.md
├── hooks/
│   ├── hooks.json
│   └── session-start
├── CONNECTORS.md
└── README.md
```

CONNECTORS.md:
```markdown
# Connectors

| Placeholder | Category | Description |
|------------|----------|-------------|
| ~~project tracker | Project Management | Issue tracking system (Linear, Jira, etc.) |
| ~~alerting system | Monitoring | Where alerts come from (PagerDuty, OpsGenie, etc.) |
| ~~deploy pipeline | CI/CD | Deployment system (GitHub Actions, CircleCI, etc.) |
```
