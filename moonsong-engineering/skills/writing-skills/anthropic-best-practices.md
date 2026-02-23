# Anthropic's skill authoring best practices

This file points to Anthropic's official resources on writing effective skills. Read these before creating or modifying skills.

## Official documentation

- **Best practices guide**: <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices>
- **Skills overview**: <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>

## Anthropic's skill-creator

For eval tooling, benchmarking, and automated description optimization, see Anthropic's `skill-creator` skill:

- **Repository**: <https://github.com/anthropics/skills/tree/main/skills/skill-creator>
- Includes grader, analyzer, and comparator agents for evaluating skill quality
- Provides Python scripts for running evals, aggregating benchmarks, and packaging skills

## Key principles (summary)

These are the most important points from the official docs. Read the full guide for details.

1. **Concise is key** - The context window is a shared resource. Only add context Claude doesn't already have. Challenge each piece of information: "Does this paragraph justify its token cost?"

2. **Set appropriate degrees of freedom** - Match specificity to fragility. Narrow bridge (fragile operations) = exact instructions. Open field (flexible tasks) = general direction.

3. **Progressive disclosure** - SKILL.md is a table of contents. Keep it under 500 lines. Split details into separate files that Claude loads on demand. Keep references one level deep.

4. **Test with all models** - What works for Opus might need more detail for Haiku. Test with all models you plan to use.

5. **Build evaluations first** - Create evals BEFORE writing docs. Establish baseline without the skill, then write minimal instructions to pass evals.

6. **Write effective descriptions** - Always third person. Be specific and include key terms. The description is how Claude selects the right skill from 100+ available.

7. **Implement feedback loops** - Run validator, fix errors, repeat. This pattern greatly improves output quality.

8. **Avoid anti-patterns** - No offering too many options (provide a default with escape hatch). No time-sensitive information. Consistent terminology throughout.
