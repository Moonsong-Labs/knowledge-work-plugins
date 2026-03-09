---
name: create-plugin
description: Use when creating a new plugin for AI coding assistants, scaffolding plugin directory structures, starting a new plugin project from scratch, or porting existing skills from another repository
---

# Create Plugin

## Overview

Guide users through creating a complete plugin for AI coding assistants (Claude Code, Cursor, CodeX, OpenCode) via a structured conversational workflow. Produces a fully scaffolded plugin directory with platform configs, first component, and validation.

## Checklist

You MUST create a task for each phase and complete them in order:

1. **Phase 1: Discovery** - understand purpose, audience, platforms, distribuability
2. **Phase 2: Component Planning** - determine component types and names
3. **Phase 3: Design First Component** - detailed design of the first skill/agent/command
4. **Phase 4: Implementation** - generate all plugin files
5. **Phase 5: Validation** - verify structure and report issues

## Phase 1: Discovery

Ask these questions one at a time:

1. **"What does your plugin do?"** - Purpose and problem it solves
2. **"Who is the audience?"** - Individual, team, or community
3. **"Is this plugin meant to be shared across organizations?"**
   - Yes → enable `~~placeholder` support, will generate CONNECTORS.md
   - No → concrete tool references only
4. **"Which platforms should it support?"** - Default: all four (Claude Code, Cursor, CodeX, OpenCode)

Capture:
- `plugin_name` (kebab-case)
- `description` (one sentence)
- `author_name` (default: "Moonsong Labs")
- `is_distributable` (boolean)
- `platforms` (list)

## Phase 2: Component Planning

Ask: **"Are you creating components from scratch, or porting existing ones from another source (e.g. a GitHub repo)?"**

- **Porting** → ask for the source (repo URL, local path, etc.). Fetch and inventory the existing components. Present the inventory for confirmation. Phase 3 can be skipped since content already exists.
- **From scratch** → continue with the standard flow below.

Ask: **"What components does your plugin need?"**

Present options:
- **Skills** - auto-activated domain knowledge and workflows
- **Agents** - specialized subagents for specific domains
- **Commands** - slash commands users invoke explicitly
- **Hooks** - event-triggered behaviors (e.g., session start)

For each selected type, ask for names (kebab-case). Present a confirmation table:

```
| Component | Count | Names                        |
|-----------|-------|------------------------------|
| Skills    | 2     | sprint-planning, code-review |
| Agents    | 1     | sprint-reviewer              |
| Commands  | 0     | -                            |
| Hooks     | 0     | -                            |
```

Get user confirmation before proceeding.

## Phase 3: Design First Component

**Skip this phase if porting existing components** — all content already exists and will be written directly in Phase 4.

Pick the first component from the plan (prefer skills, then agents, then commands).

**For a skill:**
- What triggers it? (symptoms, conditions)
- What's the core workflow or pattern?
- Any checklist items?
- Write full SKILL.md content

**For an agent:**
- What domain does it specialize in?
- What capabilities should it have?
- When should it be invoked?
- Write full agent .md content

**For a command:**
- What does it do when invoked?
- Does it delegate to a skill?
- Write full command .md content

Present the designed component for user approval before proceeding.

## Phase 4: Implementation

**Determine plugin location:**
- If inside the knowledge-work-plugins repo (check for `.claude-plugin/marketplace.json` in parent directories): create as sibling to existing plugins
- Otherwise: ask the user where to create it

Generate files in this order:

### 4.1 Directory structure

Create all directories based on the component plan.

### 4.2 Platform configs

Generate for each selected platform. See `references/component-schemas.md` for exact formats.

**Claude Code** (.claude-plugin/plugin.json):
- Required: `name`, `description`, `version` (start at 0.1.0), `author`

**Cursor** (.cursor-plugin/plugin.json):
- Same as Claude Code plus `displayName` and path fields for each component type

**CodeX** (.codex/INSTALL.md):
- Clone-and-symlink instructions following the template in component-schemas.md

**OpenCode** (.opencode/INSTALL.md):
- Clone-and-symlink instructions following the template in component-schemas.md

### 4.3 Components

**If porting:** Fetch all component files from the source and write them directly. No stubs needed — all content is complete.

**If creating from scratch:**

Write the first component (full content) as designed in Phase 3. For each remaining component, create a stub file with TODO markers:

**Skill stub:**
```yaml
---
name: skill-name
description: "TODO: Use when [specific triggering conditions]"
---
```

```markdown
# Skill Name

## Overview

TODO: Core principle in 1-2 sentences.

## When to Use

TODO: Bullet list with symptoms and use cases.
```

**Agent stub:**
```yaml
---
name: agent-name
description: "TODO: Use this agent when [condition]"
model: inherit
---
```

```markdown
TODO: Define agent role and capabilities.
```

**Command stub:**
```yaml
---
description: "TODO: Brief description"
disable-model-invocation: true
---
```

```markdown
TODO: Invoke the appropriate skill.
```

### 4.5 CONNECTORS.md (if distributable)

Generate based on any `~~placeholder` references found in the designed component, plus ask if additional placeholders are needed.

### 4.6 License files

If the plugin specifies a `license` in plugin.json, create the corresponding license file(s):
- Single license (e.g. `MIT`) → create `LICENSE`
- Dual license (e.g. `MIT OR Apache-2.0`) → create `LICENSE-MIT` and `LICENSE-APACHE`
- If porting from a source that already has license files, copy them

### 4.7 README.md

Generate a README with:
- Plugin name and description
- What's inside (list of components)
- Installation instructions per platform
- Contributing section (if community plugin)

## Phase 5: Validation

Run these checks and report results:

1. **Structure check** - all required files exist:
   - `.claude-plugin/plugin.json` exists and has `name` field
   - `.cursor-plugin/plugin.json` exists (if Cursor platform selected)
   - `.codex/INSTALL.md` exists (if CodeX platform selected)
   - `.opencode/INSTALL.md` exists (if OpenCode platform selected)
   - At least one component exists

2. **SKILL.md validation** (for each skill):
   - Has YAML frontmatter with `name` and `description`
   - `name` uses only letters, numbers, hyphens
   - `description` starts with "Use when" (or is a TODO stub)
   - Frontmatter total under 1024 characters

3. **Connector validation** (if distributable):
   - Every `~~placeholder` in content files has an entry in CONNECTORS.md
   - No CONNECTORS.md entries without corresponding `~~placeholder` usage

4. **Report** - present results as:
   ```
   Validation Results:
   [PASS] Structure: all required files present
   [PASS] Skills: frontmatter valid (2/2)
   [WARN] Connectors: ~~chat tool defined but not used in any file
   ```

After validation, if inside the monorepo, ask whether to register in marketplace.json.

## When Inside the Monorepo

If the plugin is created inside the knowledge-work-plugins repo, also:

1. Add entry to `/.claude-plugin/marketplace.json`:
   ```json
   {
     "name": "plugin-name",
     "description": "Plugin description",
     "version": "0.1.0",
     "source": "./plugin-name",
     "author": { "name": "Author Name" }
   }
   ```

2. Add entry to root `README.md` under the Plugins section

3. **CODEOWNERS** — if a `CODEOWNERS` file exists at the repo root, ask the user if the new plugin needs a dedicated owner entry (e.g. a GitHub team). If so, add a rule like `/plugin-name/ @org/team`. If no `CODEOWNERS` file exists, ask if the user wants one created.

4. Remind user to follow `writing-skills` skill's TDD process for each skill stub
